package handlers

import (
    "context"
    "encoding/json"
    "net/http"
    "time"
    "github.com/gorilla/mux"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "serveur/models"
    "serveur/utils"
)

func GetCommentsHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    recipeID := vars["id"]
    collection := db.Collection("comments")
    var comments []models.Comment
    filter := bson.M{"recipeId": recipeID}
    cur, _ := collection.Find(context.TODO(), filter)
    defer cur.Close(context.TODO())
    for cur.Next(context.TODO()) {
        var comment models.Comment
        cur.Decode(&comment)
        comments = append(comments, comment)
    }
    cur.Err()
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(comments)
}

func AddCommentHandler(w http.ResponseWriter, r *http.Request) {
    tokenString := r.Header.Get("Authorization")[7:]
    userName, _ := utils.GetUserNameFromToken(tokenString)
    vars := mux.Vars(r)
    recipeID := vars["id"]
    if recipeID == "" {
        http.Error(w, "il faut un id", http.StatusBadRequest)
        return
    }
    var comment models.Comment
    json.NewDecoder(r.Body).Decode(&comment) 
    comment.RecipeId = recipeID
    comment.UserName = userName
    comment.CreatedAt = time.Now()
    comment.ID = primitive.NewObjectID()
    collection := db.Collection("comments")
    collection.InsertOne(context.TODO(), comment)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(comment)
}

func DeleteCommentHandler(w http.ResponseWriter, r *http.Request) {
    tokenString := r.Header.Get("Authorization")[7:]
    userName,_ := utils.GetUserNameFromToken(tokenString)
    vars := mux.Vars(r)
    commentID, _ := primitive.ObjectIDFromHex(vars["commentId"])
    collection := db.Collection("comments")
    var comment models.Comment
    collection.FindOne(context.TODO(), bson.M{"_id": commentID}).Decode(&comment)
    if comment.UserName != userName {
        http.Error(w, "Forbidden status", http.StatusForbidden)
        return
    }
    collection.DeleteOne(context.TODO(), bson.M{"_id": commentID})
    w.WriteHeader(http.StatusOK)
}
