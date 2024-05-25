package models

import (
    "go.mongodb.org/mongo-driver/bson/primitive"
    "time"
)

type Credentials struct {
    Password string `json:"password"`
    Email    string `json:"email"`
    Login    string `json:"login"`
}

type LoginCredentials struct {
    Password string `json:"password"`
    Email    string `json:"email"`
}

type User struct {
    Email      string `bson:"email"`
    Password   string `bson:"password"`
    UserName   string `bson:"username"`
    ProfilePic string `bson:"profilePic"`
}

type Comment struct {
    ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    RecipeId  string             `bson:"recipeId"`
    UserName  string             `bson:"userName"`
    Comment   string             `bson:"comment"`
    CreatedAt time.Time          `bson:"createdAt"`
}

type FridgeItem struct {
    ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UserEmail string             `bson:"userEmail" json:"userEmail"`
    Items     []string           `bson:"items" json:"items"`
}

type Recipe struct {
    ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    RecipeId int                `bson:"recipeId" json:"recipeId"`
    Title    string             `bson:"title" json:"title"`
    Image    string             `bson:"image" json:"image"`
}
