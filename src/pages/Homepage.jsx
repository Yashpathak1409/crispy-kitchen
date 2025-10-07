import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Home = () => {
  const [ratings, setRatings] = useState([]);
  const [reload, setReload] = useState(false); // new state to trigger re-render

  // Fetch ratings from backend
  const fetchRatings = async () => {
    try {
      const response = await fetch("/api/ratings"); // Your API endpoint
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [reload]); // fetch ratings again when reload changes

  // Reload page after login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setReload(prev => !prev); // toggle reload to refresh state
    }
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Welcome to <span>Crispy Kitchen</span> 🍴
          </h1>
          <p>
            Discover, cook, and enjoy delicious recipes from around the world —
            all in one place.
          </p>
          <Link to="/" className="cta-btn">
            Explore More Recipes
          </Link>
        </div>
        <div className="hero-image">
          <img
            src="https://media.istockphoto.com/id/1060592710/vector/cartoon-smiling-chef-character.jpg?s=612x612&w=0&k=20&c=nB7lZ9nONBxPYroTno_JnbTfKueGBwzATPNPYlq7BAM="
            alt="Chef Illustration"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Browse by Category</h2>
        <div className="category-grid">
          {[
            { name: "Pizza", img: "https://content.jdmagicbox.com/comp/agra/a4/0562px562.x562.221005212140.f3a4/catalogue/chizza-and-pizza-corner-shaheed-nagar-agra-pizza-outlets-3s7c680oeq.jpg" },
            { name: "Pasta", img: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg?semt=ais_hybrid&w=740&q=80" },
            { name: "Burger", img: "https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg=" },
            { name: "Salads", img: "https://media.istockphoto.com/id/1340754104/photo/closeup-flat-top-macro-of-fresh-raw-chopped-vegetable-salad-with-romaine-lettuce-greens-sweet.jpg?s=612x612&w=0&k=20&c=w260XDt_7HO4j5uMZvDDIr-ov17xMdjeVwpst5Ct_Sg=" },
            { name: "Paneer Masala", img: "https://www.eitanbernath.com/wp-content/uploads/2020/05/Butter-Paneer-1-4x5-LOW-RES.jpeg" },
          ].map((cat, index) => (
            <div key={index} className="category-card">
              <img src={cat.img} alt={cat.name} />
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="recipes">
        <h2>Popular Recipes</h2>
        <div className="recipe-cards">
          <div className="recipe-card">
            <img
              src="https://media.istockphoto.com/id/1364262284/photo/italian-pizza-margherita-with-cheese-tomato-sauce-and-basil-on-grey-concrete-table-top-view.jpg?s=612x612&w=0&k=20&c=H_rwxtwmGQduyg_syYxVsd0VYFRI2ZbggeMsDzaGArI="
              alt="Pizza"
            />
            <h3>Cheesy Pizza</h3>
            <p>Hot, cheesy, and freshly baked with a crispy crust.</p>
          </div>
          <div className="recipe-card">
            <img
              src="https://static.toiimg.com/thumb/52446409.cms?width=1200&height=900"
              alt="Paneer"
            />
            <h3>Shahi Paneer</h3>
            <p>Rich, creamy, and authentic Indian delight.</p>
          </div>
          <div className="recipe-card">
            <img
              src="https://media.istockphoto.com/id/508425069/photo/indian-saag-paneer-curry.jpg?s=612x612&w=0&k=20&c=pDFP5t0f9zkV3U9Rt3UCkKlhBrnttNBSC8wgHGd_7E8="
              alt="Curry"
            />
            <h3>Indian Curry</h3>
            <p>Spicy and aromatic — a treat for your taste buds.</p>
          </div>
        </div>
      </section>

      {/* Testimonials / Live Ratings */}
      <section className="testimonials">
        <h2>What Our Foodies Say ❤️</h2>
        <div className="testimonial-cards">
          {ratings.length === 0 ? (
            <p>No reviews yet. Be the first to rate a recipe!</p>
          ) : (
            ratings.map((r) => (
              <div key={r._id} className="testimonial-card">
                <p>"{r.comment || "Loved it!"}"</p>
                <h4>- {r.userId?.name || "Anonymous"}</h4>
                <small>Rating: {r.rating} / 5</small>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Join Our Cooking Community 🍳</h2>
        <p>Sign up today and get access to thousands of recipes and tips.</p>
        <Link to="/signup" className="cta-btn">Sign Up</Link>
      </section>
    </div>
  );
};

export default Home;




//           src="https://media.istockphoto.com/id/1060592710/vector/cartoon-smiling-chef-character.jpg?s=612x612&w=0&k=20&c=nB7lZ9nONBxPYroTno_JnbTfKueGBwzATPNPYlq7BAM="
