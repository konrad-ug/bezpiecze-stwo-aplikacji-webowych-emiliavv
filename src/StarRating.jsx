import React, { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";
import Star from "./Star";

const createArray = (length) => [...Array(length)];

function StarRating({ productId, totalStars = 5 }) {
  const [selectedStars, setSelectedStars] = useState(0);
  const [ratings, setRatings] = useState(() => {
    const savedRatings = localStorage.getItem(`ratings_${productId}`);
    return savedRatings ? JSON.parse(savedRatings) : [];
  });
  const [review, setReview] = useState("");
  const [savedReviews, setSavedReviews] = useState(() => {
    const savedProductReviews = localStorage.getItem(`reviews_${productId}`);
    return savedProductReviews ? JSON.parse(savedProductReviews) : [];
  });
  const [showAlert, setShowAlert] = useState(false);

  const starRefs = useRef([]);

  useEffect(() => {
    const savedRatings = localStorage.getItem(`ratings_${productId}`);
    const savedProductReviews = localStorage.getItem(`reviews_${productId}`);

    setRatings(savedRatings ? JSON.parse(savedRatings) : []);
    setSavedReviews(savedProductReviews ? JSON.parse(savedProductReviews) : []);
    setSelectedStars(0);
    setReview("");
  }, [productId]);

  useEffect(() => {
    localStorage.setItem(`ratings_${productId}`, JSON.stringify(ratings));
  }, [ratings, productId]);

  useEffect(() => {
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(savedReviews));
  }, [savedReviews, productId]);

  const handleStarSelect = (rating) => {
    setSelectedStars(rating);
    setTimeout(() => {
      setSelectedStars(0);
    }, 2000);
    setRatings((prevRatings) => [...prevRatings, rating]);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    starRefs.current.forEach((star, index) => {
      if (index < rating) {
        star.classList.add("selected");
      } else {
        star.classList.remove("selected");
      }
    });
  };

  const handleReviewSubmit = () => {
    if (review.trim() && selectedStars > 0) {
      const newReview = {
        text: review,
        rating: selectedStars,
        date: new Date().toLocaleString(),
      };
      setSavedReviews((prevReviews) => [...prevReviews, newReview]);
      setReview("");
      setSelectedStars(0);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;

  return (
    <>
      {showAlert && (
        <div className="alert">You successfully added a review!</div>
      )}
      <div className="raiting-box">
        <p className="average-rating">
          Average Rating: <span>{averageRating} </span>({ratings.length}{" "}
          reviews)
        </p>
        <div>
          {createArray(totalStars).map((n, i) => (
            <Star
              key={i}
              ref={(el) => (starRefs.current[i] = el)}
              selected={selectedStars > i}
              onSelect={() => handleStarSelect(i + 1)}
            />
          ))}
        </div>
        <p>
          {selectedStars} stars out of {totalStars}
        </p>
      </div>
      <div className="review-section">
        <textarea
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
        />
        <button onClick={handleReviewSubmit}>Submit Review</button>

        {savedReviews.length > 0 && (
          <div className="reviews-list">
            <h3>All Reviews</h3>
            {savedReviews.map((savedReview, index) => (
              <div key={index} className="review">
                <p>{savedReview.text}</p>
                <div className="review-meta">
                  <span>Rating: {savedReview.rating} stars</span>
                  <span>{savedReview.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default StarRating;
