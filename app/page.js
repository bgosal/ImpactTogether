import { Item } from "@components/Item";

// TO DO: Get this data directly from a database
const items = [
  {
    id: 1,
    title: "Test",
    description: "This is a short description of item 1. It is designed to give a brief overview.",
    img: "/images/sample_logo.webp"
  },
  {
    id: 2,
    title: "Test",
    description: "This is a short description of item 2. It is designed to give a brief overview.",
    img: "https://dummyimage.com/100"
  },
  {
    id: 3,
    title: "Test",
    description: "This is a short description of item 3. It is designed to give a brief overview.",
    img: "https://dummyimage.com/100"
  },
  {
    id: 4,
    title: "Test",
    description: "This is a short description of item 4. It is designed to give a brief overview.",
    img: "https://dummyimage.com/100"
  },
  {
    id: 5,
    title: "Test",
    description: "This is a short description of item 5. It is designed to give a brief overview.",
    img: "https://dummyimage.com/100"
  },
];

export default function Home() {
  return (
    <main>
      <section className="item-container">
        <div className="filter-section">
          <input type="text" placeholder="Search..." className="filter-input"/>
          <select className="filter-dropdown">
            <option value="">Select City</option>
            <option value="langley">Langley</option>
            <option value="vancouver">Vancouver</option>
            <option value="abbotsford">Abbotsford</option>
            <option value="surrey">Surrey</option>
          </select>
          <select className="filter-dropdown">
            <option value="">Select Category</option>
            <option value="health">Health</option>
            <option value="food">Food</option>
            <option value="community">Community</option>
          </select>
          <button className="filter-button">Apply Filters</button>
        </div>

        <div className="item-list">
          {items.map(item => (
            <Item
              key={item.id}
              title={item.title}
              description={item.description}
              img={item.img}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
