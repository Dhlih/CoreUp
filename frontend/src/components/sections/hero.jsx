export default function Hero() {
  return (
    <div className="hero bg-base-200 min-h-screen"
    style={{
    backgroundImage: "url('/images/background.webp')",
     backgroundColor: "#131F24",  
  }}
    >
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Experience the excitement of learning anything with CoreUp</h1>
      <p className="py-6">
        Get an automated learning roadmap, master your dream skills, and level up with a gamified system that makes learning more addictive!
      </p>
      <button className="btn btn-primary">Learn Now →</button>
    </div>
  </div>
</div>
  );
}

