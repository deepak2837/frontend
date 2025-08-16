'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBriefcase, 
  FaFileAlt, 
  FaCode, 
  FaPen, 
  FaArrowLeft, 
  FaUpload, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaBrain,
  FaFlask,
  FaBookOpen,
  FaVideo,
  FaCube,
  FaStethoscope,
  FaUsers,
  FaArrowAltCircleUp
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const CareerPageClient = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedJob, setSubmittedJob] = useState(null); // Store the job that was submitted
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Debug logging
  console.log('Current showSuccessModal state:', showSuccessModal);
  
  // Monitor state changes
  useEffect(() => {
    console.log('showSuccessModal changed to:', showSuccessModal);
    console.log('submittedJob:', submittedJob);
    console.log('selectedJob:', selectedJob);
  }, [showSuccessModal, submittedJob, selectedJob]);

  // Real-time validation
  const validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters long';
        }
        break;
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
          error = 'Please enter a valid phone number';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const jobListings = [
    {
      id: 1,
      title: 'Software Development Engineer',
      icon: <FaCode className="w-8 h-8 text-blue-600" />,
      category: 'Technology',
      description: 'Join our dynamic development team to build innovative healthcare solutions. Work on cutting-edge technologies and contribute to products that make a real difference in medical education.',
      responsibilities: [
        'Develop and maintain web applications using modern technologies (React, Node.js, Next.js)',
        'Build scalable backend systems and APIs for medical education platform',
        'Implement 3D visualization and virtual reality features for medical simulations',
        'Collaborate with content creators and medical professionals to understand requirements',
        'Optimize platform performance and ensure high availability for medical students worldwide'
      ],
      requirements: [
        'Strong programming fundamentals in JavaScript, Python, or similar languages',
        'Experience with modern web technologies and frameworks',
        'Knowledge of 3D graphics, WebGL, or Three.js is a plus',
        'Understanding of medical education domain is beneficial',
        'Problem-solving mindset and team collaboration skills'
      ],
      benefits: [
        'Work on meaningful projects that impact medical education globally',
        'Exposure to cutting-edge technologies in healthcare',
        'Collaborate with medical professionals and educators',
        'Flexible work environment and continuous learning opportunities'
      ]
    },
    {
      id: 2,
      title: 'Medical Content Writer & Blog Creator',
      icon: <FaPen className="w-8 h-8 text-green-600" />,
      category: 'Content Creation',
      description: 'Create engaging, accurate, and educational medical content that helps students understand complex medical concepts. Write blogs, articles, and educational materials that make medical knowledge accessible.',
      responsibilities: [
        'Research and write comprehensive medical blogs and articles',
        'Create content for various medical specialties and topics',
        'Ensure accuracy and compliance with medical standards',
        'Collaborate with medical professionals for content validation',
        'Optimize content for search engines and user engagement'
      ],
      requirements: [
        'Medical background (MBBS, BDS, or related medical degree)',
        'Excellent writing and communication skills',
        'Ability to simplify complex medical concepts',
        'Research skills and attention to detail',
        'Understanding of medical terminology and concepts'
      ],
      benefits: [
        'Contribute to medical education globally',
        'Work with medical professionals and experts',
        'Continuous learning in medical field',
        'Flexible content creation schedule'
      ]
    },
    {
      id: 3,
      title: 'Mock Test Creator & Assessment Specialist',
      icon: <FaFlask className="w-8 h-8 text-purple-600" />,
      category: 'Assessment',
      description: 'Design comprehensive mock tests and assessments that help medical students prepare for various competitive exams. Create question banks that simulate real exam environments.',
      responsibilities: [
        'Design mock tests for various medical entrance exams (NEET, AIIMS, etc.)',
        'Create question banks with varying difficulty levels',
        'Develop assessment strategies and evaluation methods',
        'Analyze test results and improve question quality',
        'Ensure questions align with current exam patterns and syllabi'
      ],
      requirements: [
        'Medical background with understanding of competitive exams',
        'Experience in question paper setting or assessment',
        'Analytical thinking and attention to detail',
        'Knowledge of various medical entrance exam patterns',
        'Ability to create balanced and fair assessments'
      ],
      benefits: [
        'Shape the future of medical exam preparation',
        'Work with educational technology and assessment tools',
        'Contribute to student success in medical careers',
        'Continuous learning in assessment methodologies'
      ]
    },
    {
      id: 4,
      title: 'Question Bank Builder & Curriculum Specialist',
      icon: <FaBookOpen className="w-8 h-8 text-orange-600" />,
      category: 'Education',
      description: 'Build comprehensive question banks covering all medical subjects and topics. Organize content systematically to help students master medical concepts through practice.',
      responsibilities: [
        'Create extensive question banks for medical subjects',
        'Organize questions by topic, difficulty, and learning objectives',
        'Develop curriculum-aligned question sets',
        'Ensure question quality and accuracy',
        'Update question banks based on latest medical developments'
      ],
      requirements: [
        'Medical background with strong subject knowledge',
        'Experience in medical education or teaching',
        'Organizational and analytical skills',
        'Understanding of curriculum development',
        'Attention to detail and quality assurance'
      ],
      benefits: [
        'Build comprehensive learning resources for medical students',
        'Work with cutting-edge educational technology',
        'Contribute to systematic medical education',
        'Continuous learning in medical subjects'
      ]
    },
    {
      id: 5,
      title: 'Case Study Researcher & Medical Writer',
      icon: <FaStethoscope className="w-8 h-8 text-red-600" />,
      category: 'Research',
      description: 'Research and develop detailed medical case studies that help students understand real-world medical scenarios. Create comprehensive case-based learning materials.',
      responsibilities: [
        'Research and analyze medical case studies',
        'Write detailed case study reports and learning materials',
        'Collaborate with medical professionals for case validation',
        'Develop case-based learning methodologies',
        'Ensure accuracy and educational value of case studies'
      ],
      requirements: [
        'Medical background with research experience',
        'Strong analytical and research skills',
        'Experience in case study development',
        'Understanding of medical education principles',
        'Excellent writing and documentation skills'
      ],
      benefits: [
        'Work on real-world medical cases and scenarios',
        'Contribute to evidence-based medical education',
        'Collaborate with medical professionals and researchers',
        'Develop expertise in medical case analysis'
      ]
    },
    {
      id: 6,
      title: '3D Model Developer & Medical Visualization Specialist',
      icon: <FaCube className="w-8 h-8 text-indigo-600" />,
      category: 'Technology',
      description: 'Create detailed 3D models and visualizations of medical structures, organs, and procedures. Help students understand complex anatomical concepts through interactive 3D experiences.',
      responsibilities: [
        'Develop 3D models of human anatomy and medical procedures',
        'Create interactive 3D visualizations for medical education',
        'Collaborate with medical professionals for anatomical accuracy',
        'Optimize 3D models for web and mobile platforms',
        'Develop virtual reality and augmented reality experiences'
      ],
      requirements: [
        'Experience in 3D modeling and visualization software',
        'Understanding of human anatomy and medical concepts',
        'Knowledge of 3D graphics programming (Three.js, WebGL)',
        'Creative thinking and attention to detail',
        'Portfolio of 3D medical models is a plus'
      ],
      benefits: [
        'Work at the intersection of technology and medical education',
        'Create innovative learning experiences',
        'Collaborate with medical professionals and educators',
        'Exposure to cutting-edge 3D and VR technologies'
      ]
    },
    {
      id: 7,
      title: 'Video Content Creator & Medical Educator',
      icon: <FaVideo className="w-8 h-8 text-pink-600" />,
      category: 'Media',
      description: 'Create engaging video content for medical education, including lectures, demonstrations, and educational videos. Help students learn through visual and auditory content.',
      responsibilities: [
        'Plan and script medical educational videos',
        'Record and edit high-quality video content',
        'Create animations and visual effects for medical concepts',
        'Ensure content accuracy and educational value',
        'Optimize videos for various platforms and devices'
      ],
      requirements: [
        'Medical background with teaching experience',
        'Video production and editing skills',
        'Understanding of medical concepts and terminology',
        'Creative storytelling and presentation skills',
        'Experience with video editing software'
      ],
      benefits: [
        'Create impactful educational content for global audience',
        'Work with modern video production technologies',
        'Contribute to visual medical education',
        'Flexible content creation schedule'
      ]
    },
    {
      id: 8,
      title: 'Community Manager & Student Engagement Specialist',
      icon: <FaUsers className="w-8 h-8 text-teal-600" />,
      category: 'Community',
      description: 'Build and manage the MedGloss community of medical students and professionals. Foster engagement, organize events, and create a supportive learning environment.',
      responsibilities: [
        'Manage online community platforms and social media',
        'Organize virtual and in-person educational events',
        'Foster student engagement and collaboration',
        'Develop community guidelines and moderation policies',
        'Create engagement strategies and community programs'
      ],
      requirements: [
        'Experience in community management or student affairs',
        'Strong communication and interpersonal skills',
        'Understanding of medical education and student needs',
        'Experience with social media and community platforms',
        'Organizational and event planning skills'
      ],
      benefits: [
        'Build a global medical education community',
        'Work with diverse student populations',
        'Develop community engagement strategies',
        'Contribute to student success and networking'
      ]
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, resume: file }));
    } else {
      toast.error('Please upload a PDF file');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // // Client-side validation
    // if (!formData.name || !formData.email || !formData.phone || !formData.resume) {
    //   toast.error('Please fill in all required fields');
    //   return;
    // }

    // // Validate email format
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(formData.email)) {
    //   toast.error('Please enter a valid email address');
    //   return;
    // }

    // // Validate phone number (basic validation)
    // const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    // if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
    //   toast.error('Please enter a valid phone number');
    //   return;
    // }

    // // Validate name (at least 2 characters)
    // if (formData.name.trim().length < 2) {
    //   toast.error('Name must be at least 2 characters long');
    //   return;
    // }

    setIsSubmitting(true);
    
    try {
      // const formDataToSend = new FormData();
      // formDataToSend.append('name', formData.name);
      // formDataToSend.append('email', formData.email);
      // formDataToSend.append('phone', formData.phone);
      // formDataToSend.append('resume', formData.resume);
      // formDataToSend.append('position', selectedJob.title);

      // const response = await fetch('/api/career/apply', {
      //   method: 'POST',
      //   body: formDataToSend,
      // });

      // const responseData = await response.json();
      // console.log('Response status:', response.status);
      // console.log('Response data:', responseData);

   if (true) {
    // console.log('Application submitted successfully:', responseData);
    //   toast.success('Application submitted successfully! 🎉');
    //   setFormData({ name: '', email: '', phone: '', resume: null });
    //   setErrors({ name: '', email: '', phone: '' });
    //   setSubmittedJob(selectedJob);
      setShowSuccessModal(true); // Open modal immediately after setting submittedJob
    } else {
      let errorMessage = 'Failed to submit application';
      if (response.status === 400) {
        errorMessage = responseData.message || 'Please check your input and try again';
      } else if (response.status === 500) {
        errorMessage = 'Failed to submit application. Please try again later.';
      } else {
        errorMessage = responseData.message || 'An unexpected error occurred';
      }
      toast.error(errorMessage);
    }
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedJob(null);
    setSubmittedJob(null); // Clear the submitted job
    // Reset form and go back to job listings
    setFormData({ name: '', email: '', phone: '', resume: null });
    setErrors({ name: '', email: '', phone: '' });
  };

  if (selectedJob) {
    return (
      <>
          {showSuccessModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto w-full z-50 flex items-start md:items-center justify-center pt-10 md:pt-16"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative mx-auto p-3 sm:p-4 md:p-6 border-0 w-full max-w-xs sm:max-w-sm md:max-w-md shadow-2xl rounded-2xl bg-white transform transition-all"
          >
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                <FaCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              {/* Success Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                🎉 Application Submitted Successfully!
              </h2>
              
              {/* Success Message */}
              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                Thank you for your interest in joining MedGloss. We have received your application and will review it carefully. 
                Our team will get back to you within <span className="font-semibold text-blue-600">5-7 business days</span>.
              </p>
              
              {/* Next Steps */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl mb-4 border border-blue-200">
                <h3 className="text-base font-semibold text-blue-900 mb-2">📋 What happens next?</h3>
                <div className="grid grid-cols-1 gap-2 text-left text-xs md:grid-cols-2">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <h4 className="font-medium text-blue-900">Application Review</h4>
                      <p className="text-xs text-blue-700">Our team will carefully review your application</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <h4 className="font-medium text-blue-900">Shortlisting</h4>
                      <p className="text-xs text-blue-700">Shortlisted candidates will be contacted</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <h4 className="font-medium text-blue-900">Interview</h4>
                      <p className="text-xs text-blue-700">Interview process will be scheduled</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <h4 className="font-medium text-blue-900">Decision</h4>
                      <p className="text-xs text-blue-700">Final decision within 2-3 weeks</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Application Details */}
              <div className="bg-gray-50 p-2 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-1 text-sm">📝 Application Summary</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="font-medium">Position:</span> {submittedJob?.title || 'Selected Position'}</p>
                  <p><span className="font-medium">Applied:</span> {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={closeSuccessModal}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                👍 Got it! Take me back to Careers
              </button>
              
              {/* Additional Info */}
              <p className="text-xs text-gray-500 mt-2">
                You will also receive a confirmation email shortly.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedJob(null)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
            >
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to Job Listings
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center mb-6">
                {selectedJob.icon}
                <div className="ml-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Apply for {selectedJob.title}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">{selectedJob.category}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
                <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedJob.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {selectedJob.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaArrowAltCircleUp className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume (PDF) *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-800 font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PDF files only, max 10MB</p>
                    {formData.resume && (
                      <div className="mt-4 flex items-center justify-center text-green-600">
                        <FaCheckCircle className="w-5 h-5 mr-2" />
                        {formData.resume.name}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaBriefcase className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our Medical Education Revolution
          </h1>
          
                      {/* Test button for debugging */}
        
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At MedGloss, we are building the future of medical education. Join our team of passionate professionals 
            who are committed to making quality medical education accessible to students worldwide. From cutting-edge 
            technology to engaging content creation, we offer diverse opportunities to make a real impact.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {jobListings.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                {job.icon}
                <div className="ml-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {job.category}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {job.title}
              </h2>

              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                {job.description}
              </p>

              <button
                onClick={() => setSelectedJob(job)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all"
              >
                View Details & Apply
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Join MedGloss?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaCode className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">Work with cutting-edge technologies in healthcare and education</p>
            </div>
            <div>
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaFileAlt className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Impact</h3>
              <p className="text-gray-600 text-sm">Make a real difference in medical education globally</p>
            </div>
            <div>
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaBrain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Learning</h3>
              <p className="text-gray-600 text-sm">Continuous learning and professional development</p>
            </div>
            <div>
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaUsers className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">Join a passionate team of medical education enthusiasts</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      {console.log('Rendering modal check:', { showSuccessModal, submittedJob })}
  
      </div>
    </>
  );
};

export default CareerPageClient;