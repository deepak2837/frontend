const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Get all universities that have PYQ papers
export const getUniversitiesWithPYQ = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/pyq/dropdowns`);
    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }
    const data = await response.json();
    return data.success ? data.data.universities : [];
  } catch (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
};

// Get courses for a specific university
export const getCoursesForUniversity = async (universityName) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/pyq/filtered-dropdowns?universityName=${encodeURIComponent(universityName)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    const data = await response.json();
    return data.success ? data.data.courses : [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Get subjects for a specific university and course
export const getSubjectsForUniversityAndCourse = async (universityName, courseName) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/pyq/filtered-dropdowns?universityName=${encodeURIComponent(universityName)}&courseName=${encodeURIComponent(courseName)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }
    const data = await response.json();
    return data.success ? data.data.subjects : [];
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
};

// Get years for a specific university, course, and subject
export const getYearsForUniversityCourseSubject = async (universityName, courseName, subject) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/pyq/filtered-dropdowns?universityName=${encodeURIComponent(universityName)}&courseName=${encodeURIComponent(courseName)}&subject=${encodeURIComponent(subject)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch years');
    }
    const data = await response.json();
    return data.success ? data.data.years : [];
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
};

// Get PYQ papers for a specific filter combination
export const getPYQPapers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'all') {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await fetch(`${BASE_URL}/api/v1/pyq?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch PYQ papers');
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching PYQ papers:', error);
    return [];
  }
};

// Get PYQ paper by ID
export const getPYQPaperById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/pyq/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch PYQ paper');
    }
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching PYQ paper:', error);
    return null;
  }
}; 