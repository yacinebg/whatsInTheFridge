package handlers

import (
    "context"
    "encoding/json"
    "net/http"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "serveur/models"
    "serveur/utils"
)

var db *mongo.Database

func SetDatabase(database *mongo.Database) {
    db = database
}

func Signup(w http.ResponseWriter, r *http.Request) {
    var creds models.Credentials
    if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    collection := db.Collection("users")
    count, err := collection.CountDocuments(context.TODO(), bson.M{"email": creds.Email})
    if err != nil {
        http.Error(w, "Database error", http.StatusInternalServerError)
        return
    }

    if count > 0 {
        http.Error(w, "User already exists", http.StatusBadRequest)
        return
    }

    _, err = collection.InsertOne(context.TODO(), bson.M{
        "email":    creds.Email,
        "password": creds.Password,
        "username": creds.Login,
    })
    if err != nil {
        http.Error(w, "Failed to create user", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"status": "user created"})
}

func Login(w http.ResponseWriter, r *http.Request) {
    var creds models.LoginCredentials
    if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    collection := db.Collection("users")
    var user models.User
    err := collection.FindOne(context.TODO(), bson.M{"email": creds.Email}).Decode(&user)
    if err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    if user.Password != creds.Password {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    tokenString, err := utils.GenerateJWT(user.Email)
    if err != nil {
        http.Error(w, "Failed to generate token", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{
        "token":    tokenString,
        "userName": user.UserName,
    })
}
