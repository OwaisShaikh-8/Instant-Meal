
import img from "../assets/images/dealsdemoimg.jpg"

const DealsMarque = () => {
  const deals = [
    { name: "Pizza Hut", offer: "Flat 30% OFF" },
    { name: "Burger Lab", offer: "Buy 1 Get 1" },
    { name: "KFC", offer: "20% OFF Buckets" },
    { name: "McDonald's", offer: "Free Fries" },
    { name: "McDonald's", offer: "Free Fries" },
    { name: "McDonald's", offer: "Free Fries" },
    { name: "McDonald's", offer: "Free Fries" },
    { name: "McDonald's", offer: "Free Fries" },
    { name: "McDonald's", offer: "Free Fries" },
    { name: "McDonald's", offer: "Free Fries" },
    { name: "McDonald's", offer: "Free Fries" },
  ];

  return (
    <div className="overflow-hidden mt-[40px]">
      <div className="flex w-max gap-6 animate-marquee">
        {[...deals, ...deals].map((deal, index) => (
          <div
            key={index}
            className="min-w-[260px] bg-white p-4 rounded-xl shadow border cursor-pointer"
          >
            <figure className="w-[260px]">
            <img src={img} alt="" className="object-cover " />

            </figure>
            <h3 className="text-lg font-bold">{deal.name}</h3>
            <p className="text-green-600 font-semibold">{deal.offer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsMarque;
