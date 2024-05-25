package utils

import (
    "github.com/dgrijalva/jwt-go"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "context"
    "time"
    "net/http"
    "serveur/models"
)

var db *mongo.Database

func SetDatabase(database *mongo.Database) {
    db = database
}

func GenerateJWT(email string) (string, error) {
    token := jwt.New(jwt.SigningMethodHS256)
    claims := token.Claims.(jwt.MapClaims)
    claims["email"] = email
    claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

    tokenString, err := token.SignedString([]byte("your_secret_key"))
    return tokenString, err
}

func ValidateTokenMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenString := r.Header.Get("Authorization")[7:]
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte("your_secret_key"), nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        next(w, r)
    }
}

func GetUserNameFromToken(tokenString string) (string, error) {
    token, err := jwt.ParseWithClaims(tokenString, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
        return []byte("your_secret_key"), nil
    })
    if err != nil || !token.Valid {
        return "", err
    }

    claims, ok := token.Claims.(*jwt.MapClaims)
    if !ok || !token.Valid {
        return "", err
    }

    email, ok := (*claims)["email"].(string)
    if !ok {
        return "", err
    }

    var user models.User
    collection := db.Collection("users")
    err = collection.FindOne(context.TODO(), bson.M{"email": email}).Decode(&user)
    if err != nil {
        return "", err
    }

    return user.UserName, nil
}