package handlers

import (
    "context"
    "encoding/json"
    "net/http"
    "os"
    "github.com/cloudinary/cloudinary-go/v2"
    "github.com/cloudinary/cloudinary-go/v2/api/uploader"
    "github.com/dgrijalva/jwt-go"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "serveur/models"
    "serveur/utils"
    "github.com/gorilla/mux"
)

func GetUserProfile(w http.ResponseWriter, r *http.Request) {
    tokenString := r.Header.Get("Authorization")[7:]
    token, err := jwt.ParseWithClaims(tokenString, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
        return []byte("your_secret_key"), nil
    })

    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    if claims, ok := token.Claims.(*jwt.MapClaims); ok && token.Valid {
        userEmail := (*claims)["email"].(string)

        var user models.User
        collection := db.Collection("users")
        err := collection.FindOne(context.TODO(), bson.M{"email": userEmail}).Decode(&user)
        if err != nil {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }

        user.Password = ""

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(user)
    } else {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
    }
}

func UploadProfileImage(w http.ResponseWriter, r *http.Request) {
    tokenString := r.Header.Get("Authorization")[7:]
    token, err := jwt.ParseWithClaims(tokenString, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
        return []byte("your_secret_key"), nil
    })
    if err != nil || !token.Valid {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    claims, ok := token.Claims.(*jwt.MapClaims)
    if !ok || !token.Valid {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }

    userEmail := (*claims)["email"].(string)

    // Parse the form to retrieve the file
    err = r.ParseMultipartForm(10 << 20) // Max 10 MB
    if err != nil {
        http.Error(w, "Error parsing form", http.StatusBadRequest)
        return
    }

    file, handler, err := r.FormFile("image")
    if err != nil {
        http.Error(w, "Error retrieving the file", http.StatusBadRequest)
        return
    }
    defer file.Close()

    // Initialize Cloudinary
    cld, err := cloudinary.NewFromParams(os.Getenv("CLOUDINARY_CLOUD_NAME"), os.Getenv("CLOUDINARY_API_KEY"), os.Getenv("CLOUDINARY_API_SECRET"))
    if err != nil {
        http.Error(w, "Error initializing Cloudinary", http.StatusInternalServerError)
        return
    }

    // Upload the image to Cloudinary
    uploadResult, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{PublicID: userEmail + "_" + handler.Filename})
    if err != nil {
        http.Error(w, "Error uploading to Cloudinary", http.StatusInternalServerError)
        return
    }

    // Update the user's profile image URL in MongoDB
    collection := db.Collection("users")
    _, err = collection.UpdateOne(context.TODO(), bson.M{"email": userEmail}, bson.M{
        "$set": bson.M{"profilePic": uploadResult.SecureURL},
    })
    if err != nil {
        http.Error(w, "Error updating user profile", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"profilePic": uploadResult.SecureURL})
}

func DeleteUserCommentHandler(w http.ResponseWriter, r *http.Request) {
    tokenString := r.Header.Get("Authorization")[7:]
    userName, err := utils.GetUserNameFromToken(tokenString)
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    vars := mux.Vars(r)
    commentID, err := primitive.ObjectIDFromHex(vars["commentId"])
    if err != nil {
        http.Error(w, "Invalid comment ID", http.StatusBadRequest)
        return
    }

    collection := db.Collection("comments")
    var comment models.Comment
    err = collection.FindOne(context.TODO(), bson.M{"_id": commentID, "userName": userName}).Decode(&comment)
    if err != nil {
        http.Error(w, "Comment not found or not authorized", http.StatusNotFound)
        return
    }

    _, err = collection.DeleteOne(context.TODO(), bson.M{"_id": commentID})
    if err != nil {
        http.Error(w, "Failed to delete comment", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
}

func GetUserCommentsHandler(w http.ResponseWriter, r *http.Request) {
    tokenString := r.Header.Get("Authorization")[7:]
    userName, err := utils.GetUserNameFromToken(tokenString)
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    collection := db.Collection("comments")
    filter := bson.M{"userName": userName}
    cursor, err := collection.Find(context.TODO(), filter)
    if err != nil {
        http.Error(w, "Failed to find comments", http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.TODO())

    var comments []models.Comment
    for cursor.Next(context.TODO()) {
        var comment models.Comment
        if err := cursor.Decode(&comment); err != nil {
            http.Error(w, "Error decoding comment", http.StatusInternalServerError)
            return
        }
        comments = append(comments, comment)
    }

    if err := cursor.Err(); err != nil {
        http.Error(w, "Cursor error", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(comments)
}
