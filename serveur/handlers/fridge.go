package handlers

import (
    "context"
    "encoding/json"
    "net/http"
    "strings"
    "github.com/dgrijalva/jwt-go"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "serveur/models"
	"github.com/gorilla/mux"
	"fmt"
	"log"
	"io/ioutil"
)

func AddFridgeItemHandler(w http.ResponseWriter, r *http.Request) {
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
        http.Error(w, "mauvais token", http.StatusUnauthorized)
        return
    }

    userEmail := (*claims)["email"].(string)

    var fridgeItem struct {
        Items []string `json:"items"`
    }
    if err := json.NewDecoder(r.Body).Decode(&fridgeItem); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    if fridgeItem.Items == nil {
        fridgeItem.Items = []string{}
    }

    item := models.FridgeItem{
        UserEmail: userEmail,
        Items:     fridgeItem.Items,
    }

    collection := db.Collection("fridgeItems")
    result, err := collection.InsertOne(context.TODO(), item)
    if err != nil {
        http.Error(w, "Failed to add fridge item", http.StatusInternalServerError)
        return
    }

    item.ID = result.InsertedID.(primitive.ObjectID)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(item)
}

func GetFridgeItemsHandler(w http.ResponseWriter, r *http.Request) {
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
        http.Error(w, "mauvais token", http.StatusUnauthorized)
        return
    }

    userEmail := (*claims)["email"].(string)

    collection := db.Collection("fridgeItems")
    filter := bson.M{"userEmail": userEmail}
    cursor, err := collection.Find(context.TODO(), filter)
    if err != nil {
        http.Error(w, "Failed to find fridge items", http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.TODO())

    var fridgeItems []models.FridgeItem
    for cursor.Next(context.TODO()) {
        var item models.FridgeItem
        if err := cursor.Decode(&item); err != nil {
            http.Error(w, "Error decoding fridge item", http.StatusInternalServerError)
            return
        }
        fridgeItems = append(fridgeItems, item)
    }

    if err := cursor.Err(); err != nil {
        http.Error(w, "Cursor error", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(fridgeItems)
}

func DeleteFridgeItemHandler(w http.ResponseWriter, r *http.Request) {
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
        http.Error(w, "mauvais token", http.StatusUnauthorized)
        return
    }

    userEmail := (*claims)["email"].(string)

    vars := mux.Vars(r)
    itemID, err := primitive.ObjectIDFromHex(vars["itemID"])
    if err != nil {
        http.Error(w, "Invalid item ID", http.StatusBadRequest)
        return
    }

    collection := db.Collection("fridgeItems")
    result, err := collection.DeleteOne(context.TODO(), bson.M{"_id": itemID, "userEmail": userEmail})
    if err != nil {
        http.Error(w, "Failed to delete fridge item", http.StatusInternalServerError)
        return
    }

    if result.DeletedCount == 0 {
        http.Error(w, "Item not found or not authorized", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusOK)
}

func GetRecipesByFridgeItemsHandler(w http.ResponseWriter, r *http.Request) {
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
        http.Error(w, "mauvais token", http.StatusUnauthorized)
        return
    }

    userEmail := (*claims)["email"].(string)

    collection := db.Collection("fridgeItems")
    var fridgeItems models.FridgeItem
    err = collection.FindOne(context.TODO(), bson.M{"userEmail": userEmail}).Decode(&fridgeItems)
    if err != nil {
        http.Error(w, "Failed to find fridge items", http.StatusInternalServerError)
        return
    }

    ingredients := strings.Join(fridgeItems.Items, ",")
    url := fmt.Sprintf("%s/recipes/findByIngredients?apiKey=%s&ingredients=%s&number=10", spoonacularBaseURL, spoonacularAPIKey, ingredients)

    resp, err := http.Get(url)
    if err != nil {
        log.Printf("Error calling Spoonacular API: %s", err)
        http.Error(w, "Failed to retrieve recipes", http.StatusInternalServerError)
        return
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        log.Printf("Error reading response body: %s", err)
        http.Error(w, "Failed to read response", http.StatusInternalServerError)
        return
    }

    if resp.StatusCode != http.StatusOK {
        log.Printf("Spoonacular API returned status code: %d", resp.StatusCode)
        http.Error(w, "API did not return OK", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(body)
}
