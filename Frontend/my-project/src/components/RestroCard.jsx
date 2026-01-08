const RestroCard = ({
  image,
  name,
  address,
}) => {
  return (
    <div className="min-w-[420px] max-w-[400px] h-[300px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ">
      
      {/* Restaurant Image */}
      <div className="h-[200px] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {name}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {address}
        </p>
      </div>
    </div>
  );
};

export default RestroCard;
