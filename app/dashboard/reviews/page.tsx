import ReviewsCard from "@/app/components/dashboard/reviews/ReviewsCard";
import ReviewList from "@/app/components/dashboard/reviews/ReviewsList";

export default function Reports() {
  return (
    <div className="">
        <h1 className="text-[#000000] text-2xl md:text-3xl font-semibold font-sora mb-3">Reviews & Ratings </h1>
      <p className="text-[#B5BCC8] text-xl md:text-2xl font-normal font-roboto mb-10">Monitor homeowner feedback and inspector performance</p>
      <div>
       <ReviewsCard/>
      </div>
      <div>
         <ReviewList/>
      </div>
    </div>
  );
}