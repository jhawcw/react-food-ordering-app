import { useEffect, useState } from "react";
import Mealitem from "./MealItem";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {};

const Meals = () => {
  const { isLoading, error, backendData: loadedMeals } = useHttp("/api/meals", requestConfig, []);

  if (isLoading) {
    return <p className="center">Fetching meals...</p>;
  }

  if (error) {
    return <Error title={"Failed to fetch meals"} message={error}></Error>;
  }

  return (
    <ul id="meals">
      {loadedMeals.length > 0 &&
        loadedMeals.map((meal) => {
          return <Mealitem meal={meal} key={meal.id}></Mealitem>;
        })}
    </ul>
  );
};

export default Meals;
