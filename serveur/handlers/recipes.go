package handlers

import (
    "fmt"
    "context"
    "encoding/json"
    "log"
    "net/http"
    "strconv"
    "github.com/gorilla/mux"
    "go.mongodb.org/mongo-driver/bson"
    "serveur/models"
    "io/ioutil"
)


// on a mis a disposition plusieurs cle pour l'api au cas ou le quota quotidien est épuisé
const spoonacularBaseURL = "https://api.spoonacular.com"
// const spoonacularAPIKey = "7c72eeaa56d544148d29a8bb4863a591"
// const spoonacularAPIKey = "a5e525ed829345069cdab86081db70ce"
const spoonacularAPIKey = "44997afd17334b439ecb17ae6cbbcd86"
// const spoonacularAPIKey =  "84e075d4122e48e681fe9cdb2bb617d3"


func GetRecipes(w http.ResponseWriter, r *http.Request) {
    pageStr := r.URL.Query().Get("page")
    page, err := strconv.Atoi(pageStr)
    if err != nil || page < 1 {
        page = 1
    }

    limit := 3
    offset := (page - 1) * limit

    url := fmt.Sprintf("%s/recipes/random?apiKey=%s&number=%d&offset=%d", spoonacularBaseURL, spoonacularAPIKey, limit, offset)

    resp, err := http.Get(url)
    if err != nil {
        log.Printf("Error Spoonacular API: %s", err)
        http.Error(w, "on a pas trouvé de recette", http.StatusInternalServerError)
        return
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        http.Error(w, "echec", http.StatusInternalServerError)
        return
    }

    if resp.StatusCode != http.StatusOK {
        log.Printf("Error Spoonacular API: %d", resp.StatusCode)
        http.Error(w, "mauvaise reponse de l'api", http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(body)
}

func GetRecipeDetail(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    url := fmt.Sprintf("%s/recipes/%s/information?includeNutrition=false&addWinePairing=false&addTasteData=false&apiKey=%s", spoonacularBaseURL, id, spoonacularAPIKey)

    resp, err := http.Get(url)
    if err != nil {
        log.Printf("Error calling Spoonacular API: %s", err)
        http.Error(w, "echec", http.StatusInternalServerError)
        return
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        http.Error(w, "echec", http.StatusInternalServerError)
        return
    }

    if resp.StatusCode != http.StatusOK {
        log.Printf("Spoonacular API returned status code: %d", resp.StatusCode)
        http.Error(w, "mauvaise reponse de l'api", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(body)
}

func GetCarouselRecipes(w http.ResponseWriter, r *http.Request) {
    collection := db.Collection("recipes")
    cursor, _ := collection.Find(context.TODO(), bson.M{})
    defer cursor.Close(context.TODO())
    var recipes []models.Recipe
    cursor.All(context.TODO(), &recipes)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(recipes)
}

func FetchNewRecipes() {
    url := fmt.Sprintf("%s/recipes/random?apiKey=%s&number=6", spoonacularBaseURL, spoonacularAPIKey)
    resp, err := http.Get(url)
    if err != nil {
        log.Printf("Error Spoonacular API: %s", err)
        return
    }
    defer resp.Body.Close()

    var result struct {
        Recipes []struct {
            ID    int    `json:"id"`
            Title string `json:"title"`
            Image string `json:"image"`
        } `json:"recipes"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        log.Printf("Error Spoonacular: %s", err)
        return
    }

    collection := db.Collection("recipes")
    collection.Drop(context.TODO())
    for _, recipe := range result.Recipes {
        newRecipe := models.Recipe{
            RecipeId: recipe.ID,
            Title:    recipe.Title,
            Image:    recipe.Image,
        }
        _, err := collection.InsertOne(context.TODO(), newRecipe)
        if err != nil {
            log.Printf("Error MongoDB: %s", err)
            return
        }
    }
}

func InitializeRecipes() {
    collection := db.Collection("recipes")

    count, err := collection.CountDocuments(context.TODO(), bson.D{})
    if err != nil {
        log.Fatalf("Error documents: %s", err)
    }

    if count == 0 {
        FetchNewRecipes()
    }
}
