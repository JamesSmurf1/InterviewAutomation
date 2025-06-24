import Button from "@/components/reusable/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-[100vw] h-[100vh] bg-black">
      <div className='w-[100%] h-[100%] flex items-center justify-center font-bold flex flex-col'>
        <div className="text-[52px] font-bold text-transparent bg-clip-text custom-gradient">
          Interview Automation For Everyone
        </div>

        <div className='text-[42px] text-white'>
          Search-View
        </div>
        <div className='text-white'>Automate Interview Process For Everyone.</div>

        <div className='pt-[50px] flex gap-[25px]'>
          <Link href='/applicant'><Button text={'Continue as Applicant'} /></Link>
          <Link href='/company'><Button text={'Continue as Company'} /></Link>

        </div>

      </div>

    </div>
  );
}
