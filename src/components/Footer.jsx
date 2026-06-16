import React from 'react'
import logo from '../assets/logo.png'
import Home from '../pages/Home'
export default function Footer() {
  return (<>
<div>
     



<footer className="bg-[#011749] w-full flex justify-center items-center mt-10">
  <div className="max-w-screen-xl w-full py-6 lg:py-8 flex flex-col items-center text-center">
    
    {/* الجزء اللى فوق (اللوجو واللينكات) */}
    <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-10">
      <div className="mb-6 md:mb-0 flex justify-center">
        <a href="#" className="flex items-center justify-center">
          <img src={logo} className="w-72 h-auto object-contain" alt="Logo" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left md:text-center">
        <div>
          <h2 className="mb-6 text-sm font-semibold text-white uppercase">About Us</h2>
          <p className="text-gray-400 max-w-xs">
            We’re a dedicated shelter helping pets find loving homes, caring sponsors, and safe travel options.
          </p>
        </div>

        <div>
          <h2 className="mb-6 text-sm font-semibold text-white uppercase">Quick Links</h2>
          <ul className="text-gray-400 font-medium space-y-2">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Adoption</a></li>
            <li><a href="#" className="hover:underline">Sponsor</a></li>
            <li><a href="#" className="hover:underline">Shop</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-6 text-sm font-semibold text-white uppercase">Support</h2>
          <ul className="text-gray-400 font-medium space-y-2">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms &amp; Conditions</a></li>
          </ul>
        </div>
      </div>
    </div>

    {/* الخط الفاصل والسوشيال ميديا */}
    <hr className="my-6 border-gray-700 w-full" />
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
      <span className="text-sm text-gray-400">  All Rights Reserved.</span>
      <div className="flex gap-5">
  {/* Facebook */}
  <a href="#" className="text-gray-400 hover:text-white">
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 8 19"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
      />
    </svg>
  </a>

  {/* Discord */}
  <a href="#" className="text-gray-400 hover:text-white">
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 21 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
    </svg>
  </a>

  {/* Twitter */}
  <a href="#" className="text-gray-400 hover:text-white">
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 17"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
      />
    </svg>
  </a>
</div>

    </div>
  </div>
</footer>




    </div>
</>
  )
}
