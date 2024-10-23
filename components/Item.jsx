import Image from "next/image";

// TO DO: Get this data directly from a database
const items = [
  {
    id: 1,
    description: "This is a short description of item 1. It is designed to give a brief overview.",
    image: "https://dummyimage.com/100"
  },
  {
    id: 2,
    description: "This is a short description of item 2. It is designed to give a brief overview.",
    image: "https://dummyimage.com/100"
  },
  {
    id: 3,
    description: "This is a short description of item 3. It is designed to give a brief overview.",
    image: "https://dummyimage.com/100"
  },
  {
    id: 4,
    description: "This is a short description of item 4. It is designed to give a brief overview.",
    image: "https://dummyimage.com/100"
  },
  {
    id: 5,
    description: "This is a short description of item 5. It is designed to give a brief overview.",
    image: "https://dummyimage.com/100"
  },
];

export const Item = () => {
  return (
    <>
      {items.map(item => (
        <div className="item" key={item.id}>
          <Image 
            src={item.image}
            alt={`Item Image ${item.id}`}
            width={100} 
            height={100}
            className="item-image"
          />
          <div className="item-description">
            <h3>Item {item.id}</h3>
            <p>{item.description}</p>
          </div>
          <div className="item-buttons">
            <button className="item-button">Volunteer</button>
            <button className="item-button">Contact</button>
          </div>
        </div>
      ))}
    </>
  );
}