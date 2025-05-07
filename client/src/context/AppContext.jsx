import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // Fetch All Courses
    const fetchAllCourses = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`);
        const data = await response.json();
        setAllCourses(data);
    };

    // Function to calculate the avg rating of a course
    const calculateRating = (course) => {
       if(course.courseRatings.length === 0) return 0;

       let totalRating = 0;
       course.courseRatings.forEach((rating) => {
           totalRating += rating.rating;
       });
       return (totalRating / course.courseRatings.length).toFixed(1);
    }

    // Function to calculate the Course Chapter Time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration);
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]});
    }

    // Function to Calculate Course Duration
    const calculateCourseDuration = (course) => {
        let time = 0;

        course.courseContent.map((chapter) => chapter.chapterContent.map(
            (lecture) => time += lecture.lectureDuration
        ))
        
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]});
    }

    // Function to calculate Number of Lecture in the Course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
          if (Array.isArray(chapter.chapterContent)) {
            totalLectures += chapter.chapterContent.length;
          }
        });
        return totalLectures;
    };

    // Fetch User Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/enrollments`);
        const data = await response.json();
        setEnrolledCourses(data);
    }
      

    useEffect(() => {
        fetchAllCourses()
        fetchUserEnrolledCourses()
    }, []);

    const value = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
