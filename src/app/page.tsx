"use client";
import { useState,useEffect,useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function Home() {
  const webcamref = useRef<Webcam>(null);
  const [image,setimage] = useState<string | null>(null);
  const [aicontent,setiacontent] = useState<string>("");

  const capture = async () => {
    const screenshot = webcamref.current?.getScreenshot();

    if (screenshot) {
      const base64 = screenshot.replace(/^data:image\/\w+;base64,/, "");

      setimage(screenshot);

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64,
                  },
                },
                {
                  text: "สิ่งในภาพนี้คืออะไร",
                },
              ],
            },
          ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
        }
      );

      setiacontent(res.data.candidates[0].content.parts[0].text);
    }
  };

  return (
    <div className="p-[50px] flex justify-center flex-col items-center">
      {image ? 
        <img src={image} alt="Captured" className="w-full max-w-md" />
        :
        <Webcam
          audio={false}
          ref={webcamref}
          screenshotFormat="image/jpeg"
          className="w-full max-w-md rounded shadow"
        />
      }

      <div onClick={image ? undefined:() => capture()} className="bg-[#018470] text-white p-[5px_50px] rounded-2xl mt-[30px] cursor-pointer">{image ? (aicontent ? "success":"process.."):"take a photo"}</div>

      <p className="mt-[20px] w-[350px]">{aicontent}</p>
    </div>
  );
}
