type CardType = {
  url: string;
  title: string;
  id: number;
};

const Card = ({ card }: { card: CardType }) => {
  return (
    <div className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200 rounded-2xl  ">
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
          {card.title}
        </p>
      </div>
    </div>
  );
};

export default Card;
