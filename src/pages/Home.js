import React, { useState, useEffect, useRef } from "react";
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch recipes from backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/recipes");
        const data = await response.json();
        if (response.ok) {
          setRecipes(data);
          setFilteredRecipes(data);
        } else {
          console.error("Failed to fetch recipes:", data.message);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = recipes.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(term);
      const categoryMatch = recipe.category.toLowerCase().includes(term);
      const ingredientMatch = recipe.ingredients.some((ing) =>
        ing.toLowerCase().includes(term)
      );
      return titleMatch || categoryMatch || ingredientMatch;
    });

    setFilteredRecipes(filtered);
  };

  // Show recipe detail
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setChatMessages([]); // Reset chat for new recipe
  };

  // Go back to recipe list
  const handleBack = () => setSelectedRecipe(null);

  // Scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle chat input
  const handleChat = async (e) => {
    e.preventDefault();
    const input = e.target.chat.value.trim();
    if (!input) return;

    // Add user message
    setChatMessages((prev) => [...prev, { sender: "user", text: input }]);
    e.target.chat.value = "";
    scrollToBottom();
    setLoadingAI(true);

    try {
      // Call your backend AI endpoint
      const response = await fetch("http://localhost:8080/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      // Add AI response
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.text || "No response from AI." },
      ]);
      scrollToBottom();
    } catch (error) {
      console.error("AI fetch error:", error);
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "AI failed to respond. Please try again." },
      ]);
      scrollToBottom();
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="home-container">
      <h1>Food Recipe App</h1>

      {/* Search Bar */}
      {!selectedRecipe && (
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by name, category or ingredient..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
      )}

      {selectedRecipe ? (
        <div className="recipe-detail">
          <button onClick={handleBack} className="back-btn">Back</button>
          <h2>{selectedRecipe.title}</h2>

          <div className="recipe-flex">
            {/* Left Column: Recipe Details */}
            <div className="recipe-left">
              {selectedRecipe.imageUrl && (
                <img
                  src={selectedRecipe.imageUrl}
                  alt={selectedRecipe.title}
                  className="recipe-image"
                />
              )}

              <div className="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div className="instructions">
                <h3>Instructions:</h3>
                <ol>
                  {selectedRecipe.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="important-notes">
                <h3>Important Notes:</h3>
                <p><strong>Category:</strong> {selectedRecipe.category}</p>
                <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTime} minutes</p>
                <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
                <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
              </div>
            </div>

            {/* Right Column: AI Assistant */}
            <div className="ai-chat-container">
              <h3 style={{ textAlign: "center", marginBottom: "10px" }}>AI Assistant</h3>

              <div className="ai-chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`chat-message ${msg.sender === "user" ? "user" : "ai"}`}
                  >
                    {msg.text}
                  </div>
                ))}

                {loadingAI && <div className="chat-message ai">AI is typing...</div>}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleChat} className="ai-chat-input">
                <input
                  type="text"
                  name="chat"
                  placeholder="Ask about this recipe..."
                  disabled={loadingAI}
                />
                <button type="submit" disabled={loadingAI}>
                  {loadingAI ? "..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="recipe-list">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="recipe-card"
                onClick={() => handleRecipeClick(recipe)}
              >
                {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} />}
                <h3>{recipe.title}</h3>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>No recipes found!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
