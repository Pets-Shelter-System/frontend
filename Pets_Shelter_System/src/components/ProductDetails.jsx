import axios from 'axios'
import Slider from "react-slick";
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Spinner from './Spinner';

export default function ProductDetails() {
 

  let {id}=useParams();
  console.log(id);

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:true,
  };



  const [productDetails,setProductDetails]=useState(null);
  
    function GetProductDetails(){
      axios.get(`http://petmarket.runasp.net/api/Products/${id}`).then(({data})=>{
        console.log(data?.data);
        setProductDetails(data?.data);
      }).catch((err)=>{
        console.log(err);
      })
    }
   

    useEffect(()=>{
        GetProductDetails();
    },[id])

  if (!productDetails) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 my-10 flex justify-center items-center text-center container">
      <div className="flex flex-col items-center max-w-full  p-6   rounded-lg bg-[#F4F4F4] shadow-xs md:flex-row  ">
         
        
        <div className="w-full md:w-1/2 p-4">
         <Slider key={productDetails.photos.length} {...settings}>
          {
          productDetails.photos.map((photo, index) => (
  <div key={index} className="w-full h-96  ">
    <img
  src={photo.imageName ? `http://petmarket.runasp.net${photo.imageName}` : '/default.png'}
  alt={productDetails.name}
  className="w-full h-auto object-cover rounded-lg"
/>

  </div>
))
          }
        </Slider>
        </div>


        <div className="flex flex-col justify-between md:p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-heading">{productDetails.name}</h5>
          <div className="text-yellow-400 text-lg">
            {"★".repeat(Math.max(0, Math.round(Number(productDetails.rating) || 0)))}
          </div>
          <h6 className="mb-2 text-lg font-medium tracking-tight text-heading">{productDetails.categoryName}</h6>
          <p className="mb-6 text-body">{productDetails.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-heading">EGP {productDetails.price}</span>
            <button
              type="button"
              className=" py-2 px-5 rounded-2xl  bg-[#011749] text-white"
            >
              Add to Cart
               
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
