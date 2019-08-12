import React, {Component, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import CourseForm from "./CourseForm";
import {newCourse} from "../../../tools/mockData";

function ManageCoursePage({courses, authors, loadAuthors, loadCourses, saveCourse, history, ...props}) {
    const [course, setCourse] = useState({...props.course});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (courses.length === 0) {
            loadCourses().catch(error => {
                alert("Loading courses failed" + error);
            });
        } else {
            setCourse({...props.course})
        }
        if (authors.length === 0) {
            loadAuthors().catch(error => {
                alert("Loading authors failed" + error);
            })
        }
    }, [props.course]);

    function handleChange(event) {
        const {name, value } = event.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value, 10) : value
        }));
    }

    function handleSave(event) {
        event.preventDefault();
        saveCourse(course).then(() => {
            history.push("/courses");
        });
    }

    return <CourseForm authors={authors} errors={errors} course={course} onChange={handleChange} onSave={handleSave}/>;
}

ManageCoursePage.propTypes = {
    course: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    courses: PropTypes.array.isRequired,
    loadCourses: PropTypes.func.isRequired,
    saveCourse: PropTypes.func.isRequired,
    loadAuthors: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

export function getCourseBySlug(courses, slug) {
    return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
    const slug = ownProps.match.params.slug;
    const course = slug && state.courses.length > 0 ? getCourseBySlug(state.courses, slug) : newCourse;
    return {
        course,
        courses: state.courses,
        authors: state.authors
    };
}

const mapDispatchToProps = {
    loadCourses: courseActions.loadCourses,
    saveCourse: courseActions.saveCourse,
    loadAuthors: authorActions.loadAuthors
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);