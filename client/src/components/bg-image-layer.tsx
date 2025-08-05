import bgImage from "/images/paclogo.png";

const BgImageLayer = () => {
  return (
    <div className="absolute inset-0 z-[0] flex items-center justify-center bg-opacity-30">
      <img
        src={bgImage}
        alt="Background"
        className="opacity-[25%] w-[300px] md:w-[400px]"
      />
    </div>
  );
};

export default BgImageLayer;
