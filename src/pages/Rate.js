import React, { useState, useEffect, useRef } from "react";
import "./Rate.css";

const Rate = ({ delay = 5000, storageKey = "recipeApp_rating_status" }) => {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const modalRef = useRef();

  // Check if user already submitted
  const hasSubmitted = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) === "submitted";
    } catch {
      return false;
    }
  };

  // Show popup
  useEffect(() => {
    if (hasSubmitted()) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Close on outside click or ESC
  useEffect(() => {
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    const handleEsc = (e) => { if (e.key === "Escape") setVisible(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        localStorage.setItem(storageKey, JSON.stringify("submitted"));
        setVisible(false);
        setRating(0);
        setComment("");
        alert("Thanks for your rating!");
      } else {
        alert("Failed to submit rating");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting rating");
    }
  };

  if (hasSubmitted()) return null;

  return visible ? (
    <div className="rate-modal-overlay">
      <div className="rate-modal" ref={modalRef}>
        <button className="rate-modal-close" onClick={() => setVisible(false)}>×</button>
        <h2>How was your experience?</h2>
        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  type="button"
                  key={i}
                  className={`star ${starValue <= (hover || rating) ? "active" : ""}`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </button>
              );
            })}
          </div>
          <textarea
            placeholder="Leave a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="rate-actions">
            <button type="button" onClick={() => setVisible(false)}>Maybe later</button>
            <button type="submit">Submit Rating</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default Rate;
