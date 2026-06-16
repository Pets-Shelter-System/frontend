import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import img1 from '../assets/2147799920.jpg'
import img2 from '../assets/unsplash_6CQx8JnO-jg.png'
import img3 from '../assets/132467.jpg'
export default function Recommended() {
  return <>
 <div className="my-10">
     <div className="flex-col justify-center items-center ">
    <div className="flex justify-center items-center   ">
         <h2 className="text-3xl font-bold text-[#011749] ">
          Recommended For You
        </h2>
<span
                role="img"
                aria-label="paw-icon"
                className="text-orange-500 text-3xl"
              >
                🐾
              </span>
              
       </div>
<div className=''>
    <p className=' text-[#E7A01C] flex justify-center items-center mt-5'>-- Pet Store --</p>
</div>
  </div>
  <div className='flex justify-center align-middle gap-6 mt-10 flex-wrap'>
      

<div className="max-w-sm w-80 bg-slate-100 border border-gray-200 rounded-lg shadow-xl overflow-hidden group transition-all duration-500 hover:bg-[#011749]">
  <div className="relative overflow-hidden flex justify-center items-center">
    {/* الصورة */}
    <img
      className="rounded-lg h-60 w-[90%] object-cover mt-4 transition-transform duration-700 group-hover:scale-110 group-hover:w-full group-hover:mt-0"
      src={img1}
      alt="product"
    />

    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center items-center">
      <button className="bg-white text-[#011749] font-semibold px-4 py-2 rounded-full hover:scale-105 transition">
        Get
      </button>
    </div>
  </div>
 <div className="flex items-center ps-5 pt-5 pb-0 gap-1 text-yellow-400">
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStarHalfAlt />
      <FaRegStar />
       
    </div>
  {/* النص */}
  <div className="p-5 text-[#011749] group-hover:text-[#f4f4f4] transition-colors duration-500">
    <h5 className="mb-2 text-2xl font-bold tracking-tight">
      Leather Pet Collar
    </h5>
    <p className="mb-3 font-normal">Comfortable & Adjustable</p>
    <p className="mb-3 font-bold">EGP 180</p>

     
   
  </div>
</div>

<div className="max-w-sm w-80 bg-slate-100 border border-gray-200 rounded-lg shadow-xl overflow-hidden group transition-all duration-500 hover:bg-[#011749]">
  <div className="relative overflow-hidden flex justify-center items-center">
   
    <img
      className="rounded-lg h-60 w-[90%] object-cover mt-4 transition-transform duration-700 group-hover:scale-110 group-hover:w-full group-hover:mt-0"
      src={img2}
      alt="product"
    />

    {/* الطبقة السوداء + الزرار */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center items-center">
      <button className="bg-white text-[#011749] font-semibold px-4 py-2 rounded-full hover:scale-105 transition">
        Get
      </button>
    </div>
  </div>
 <div className="flex items-center ps-5 pt-5 pb-0 gap-1 text-yellow-400">
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStarHalfAlt />
      <FaRegStar />
       
    </div>
  {/* النص */}
  <div className="p-5 text-[#011749] group-hover:text-[#f4f4f4] transition-colors duration-500">
    <h5 className="mb-2 text-2xl font-bold tracking-tight">
      HFO Collar
    </h5>
    <p className="mb-3 font-normal">Comfortable & Adjustable</p>
    <p className="mb-3 font-bold"> EGP 80</p>

     
   
  </div>
</div>

<div className="max-w-sm w-80 bg-slate-100 border border-gray-200 rounded-lg shadow-xl overflow-hidden group transition-all duration-500 hover:bg-[#011749]">
  <div className="relative overflow-hidden flex justify-center items-center">
     
    <img
      className="rounded-lg h-60 w-[90%] object-cover mt-4 transition-transform duration-700 group-hover:scale-110 group-hover:w-full group-hover:mt-0"
      src={img3}
      alt="product"
    />

    {/* الطبقة السوداء + الزرار */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center items-center">
      <button className="bg-white text-[#011749] font-semibold px-4 py-2 rounded-full hover:scale-105 transition">
        Get
      </button>
    </div>
  </div>
 <div className="flex items-center ps-5 pt-5 pb-0 gap-1 text-yellow-400">
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStarHalfAlt />
      <FaRegStar />
       
    </div>
  {/* النص */}
  <div className="p-5 text-[#011749] group-hover:text-[#f4f4f4] transition-colors duration-500">
    <h5 className="mb-2 text-2xl font-bold tracking-tight">
      Yummy Home Meal
    </h5>
    <p className="mb-3 font-normal">High-quality ingredients </p>
    <p className="mb-3 font-bold">EGP 100</p>

     
   
  </div>
</div>
    </div>
 </div>
  
  </>

    
    
}
