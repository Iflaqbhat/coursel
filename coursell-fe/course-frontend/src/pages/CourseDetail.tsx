import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourse, purchaseCourse, checkPurchase } from "../services/api";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageLink: string;
  creator: string;
}

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourse(id!);
        setCourse(response.data.course);
        if (token) {
          const purchaseResponse = await checkPurchase(id!);
          setIsPurchased(purchaseResponse.data.purchased);
        }
      } catch (err) {
        console.error("Fetch course error:", err);
      }
    };
    fetchCourse();
  }, [id, token]);

  const handlePurchase = async () => {
    if (!token) {
      alert("Please sign in to purchase");
      return;
    }
    try {
      await purchaseCourse(id!);
      setIsPurchased(true);
      alert("Course purchased successfully!");
    } catch (err) {
      console.error("Purchase error:", err);
      alert("Purchase failed");
    }
  };

  if (!course) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <img
          src={course.imageLink}
          alt={course.title}
          className="w-full h-64 object-cover rounded-md"
        />
        <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
        <p className="text-gray-500 mt-2">By: {course.creator}</p>
        <p className="text-blue-600 font-bold mt-2">${course.price}</p>
        {isPurchased ? (
          <p className="text-green-600 mt-4">You own this course!</p>
        ) : (
          <button
            onClick={handlePurchase}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Purchase Course
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
