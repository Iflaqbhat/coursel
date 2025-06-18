import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { getPurchases } from "../services/api";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageLink: string;
  creator: string;
}

const Purchases = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/profile");
      return;
    }
    const fetchPurchases = async () => {
      try {
        const response = await getPurchases();
        setCourses(response.data.courses);
      } catch (err) {
        console.error("Fetch purchases error:", err);
      }
    };
    fetchPurchases();
  }, [navigate, token]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        My Purchased Courses
      </h1>
      {courses.length === 0 ? (
        <p className="text-center text-gray-600">No courses purchased yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchases;
