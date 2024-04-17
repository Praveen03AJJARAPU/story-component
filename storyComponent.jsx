import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { client } from '../../client';
import { BsFacebook } from "react-icons/bs";
import CancelIcon from '@mui/icons-material/Cancel';
import '../App.css'
import DeleteIcon from '@mui/icons-material/Delete';
import { storyQuery } from './query';

const StoryComponent = () => {
   const [ index, setIndex ] = useState(0);
   const [ story, setStory ] = useState();
   const [ width, setWidth ] = useState(0);
   const [ componentWidth, setComponentWidth ] = useState(0);
   const { id } = useParams()
   const nav = useNavigate();
   var colVal;
 useEffect(() => {
   client.fetch(storyQuery(id)).then((data) => {
     setStory(data[0]);
   });
 },[])

 useEffect(() => {
   const interval = setInterval(() => {
     const progress = (width + 100 / 65) % 100;
     setWidth(progress);
   }, 100);

   return () => clearInterval(interval);
 }, [width]);
    
 useEffect(() => {
   const nextStory = () => {
     if (index <= story?.stories?.length - 1) {
       setIndex(index + 1);
       setWidth(0);
     }
     if (index === story?.stories?.length - 1) {
       nav("/home");
     }
   };

   setComponentWidth(320 / story?.stories.length);
   const interval = setInterval(nextStory, 6000);

   return () => clearInterval(interval);
 }, [index, story]);


const color = story?.stories[index]?.color;

  return (
    <div className="bg-black">
      <BsFacebook size={44} className="text-blue-500 mx-2 py-2 sticky" />
      <div className="flex  justify-center h-screen mt-10">
        <div
          className="lg:w-[375px] w-screen h-[80vh] mx-3 px-2 rounded-xl"
          style={{ backgroundColor: color }}
        >
          <div className="flex">
            {story?.stories?.map((bar, id) => (
              <div className="bar relative mt-2 mr-1" key={id}>
                <div
                  className={`w-[${componentWidth}px] h-1 mb-3 bg-slate-400 rounded-xl`}
                  style={{ width: `${componentWidth}px` }}
                ></div>
                {index === id && (
                  <div
                    className={`w-${width} ease-in duration-75 absolute top-0 rounded-xl h-1 bg-white`}
                    style={{ width: `${width}%` }}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="absolute">
            <div className="flex items-center justify-between">
              <div className="flex items-center mt-2 ml-3 mr-32">
                <img
                  src={story?.stories[index]?.postedBy?.image}
                  referrerPolicy="no-referrer"
                  className="rounded-full w-12 mr-2"
                  alt=""
                />
                <p className="text-white">
                  {story?.stories[index]?.postedBy?.userName}
                </p>
              </div>
              <div>
                <div className="flex items-center">
                  <div onClick={() => nav("/home")}>
                    <CancelIcon className="text-white " />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!story?.stories[index]?.image && (
            <p className="text-center text-3xl mt-16 font-extrabold">
              {story?.stories[index]?.message}
            </p>
          )}
          {story?.stories[index]?.image && (
            <div className='relative'>
              <img
                className="lg:mt-36 mt-12 px-2"
                src={story?.stories[index]?.image?.asset?.url}
                alt=""
                referrerPolicy="no-referrer"
              />
              <p className='text-white font-[inter] absolute top-30 left-32 backdrop-blur-lg'>{story?.stories[index]?.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoryComponent
