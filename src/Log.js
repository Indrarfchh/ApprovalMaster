import React, { useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

function generateCaptcha() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

function Log() {
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
  });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [errors, setErrors] = useState({
    employeeIdError: '',
    passwordError: '',
    captchaError: '',
    serverError: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear corresponding error message when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${name}Error`]: '',
      serverError: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setErrors({
      employeeIdError: '',
      passwordError: '',
      captchaError: '',
      serverError: '',
    });

    let hasError = false;

    // Basic client-side validation
    if (formData.employeeId.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        employeeIdError: 'Please enter your User ID',
      }));
      hasError = true;
    }

    if (formData.password.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordError: 'Please enter your password',
      }));
      hasError = true;
    }

    if (captcha !== captchaInput) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        captchaError: 'Enter the correct CAPTCHA',
      }));
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Prepare query parameters
    const queryParams = new URLSearchParams({
      employeeId: formData.employeeId,
      password: formData.password,
    });

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://hrms-application-oxy0.onrender.com/hrmsapplication/authentication/login?${queryParams.toString()}`,
        {
          method: 'POST',
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
      }

      if (response.ok) {
        // Handle successful response
        // console.log('Login successful:', data);
        // alert('Login successful');
        // Redirect to Organisation.jsx
        navigate('/App');
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          serverError: data?.message || 'Login failed. Please try again.',
        }));
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        serverError: 'An unexpected error occurred. Please try again later.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    setErrors((prevErrors) => ({
      ...prevErrors,
      captchaError: '',
    }));
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-neutral-100'>
      <div className='bg-white p-10 rounded-3xl shadow-lg w-full max-w-md mt-0'>
        <form onSubmit={handleSubmit}>
          <img
            src='https://media.licdn.com/dms/image/D560BAQFQiuOx34RWww/company-logo_200_200/0/1720769688540?e=1730937600&v=beta&t=Tfi0cXQ9shhTzXWAwIelpY6x01GJos3L6Fh-mfhTbBg'
            alt='Logo'
            className='w-50 mb-0 mx-auto'
          />
          <h1 className='text-4xl font-bold mb-6 text-center text-orange-600'>
            Login
          </h1>
          {/* {/ Display server-side errors /} */}
          {errors.serverError && (
            <div className='mb-4'>
              <p className='text-red-500 text-sm text-center'>
                {errors.serverError}
              </p>
            </div>
          )}
          <div className='mb-3 relative'>
            <label className='block text-sm font-bold mb-2 text-left'>User ID</label>

            <input
              type='text'
              name='employeeId'
              value={formData.employeeId}
              onChange={handleChange}
              required
              className={`w-full p-2 border ${errors.employeeIdError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.employeeIdError && (
              <p className='text-red-500 text-sm text-left mt-1'>
                {errors.employeeIdError}
              </p>
            )}
          </div>
          <div className='mb-4 relative'>
            <label className='block text-sm font-bold mb-2 text-left'>
              Password
            </label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full p-2 border ${
                errors.passwordError ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
            />
            {errors.passwordError && (
              <p className='text-red-500 text-sm text-left mt-1'>
                {errors.passwordError}
              </p>
            )}
          </div>
          <div className='mb-4 flex items-center'>
            <div className='bg-black text-white p-2 rounded text-xl w-32 text-center'>
              {captcha}
            </div>
            <button
              type='button'
              onClick={handleRefreshCaptcha}
              className='p-1 ml-2'
            >
              <span><FaSyncAlt /></span>
            </button>
            <div className='flex-1 ml-2 relative'>
              <input
                type='text'
                placeholder='Enter CAPTCHA'
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.slice(0, 6))}
                required
                className={`w-full p-2 border ${
                  errors.captchaError ? 'border-red-500' : 'border-gray-300'
                } rounded-md`}
              />
              {errors.captchaError && (
                <div className='absolute bottom-0 translate-y-full'>
                  <p className='text-red-500 text-sm text-left mt-1'>
                    {errors.captchaError}
                  </p>
                </div>
              )}
            </div>
          </div>
          <button
            type='submit'
            className='w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 shadow-sm mt-5 mb-5'
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Log;

