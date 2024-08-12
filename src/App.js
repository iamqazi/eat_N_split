import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [billValue, setBillValue] = useState(0);
  const [yourExpense, setYourExpense] = useState(0);
  function handleAddFriendBtn() {
    setAddFriend(!showAddFriend);
  }
  function handleAddFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    setAddFriend(false);
  }
  function handleFriendSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setAddFriend(false);
  }
  function handleSplit(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  const friendExpense = billValue ? billValue - yourExpense : "";

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          selectedFriend={selectedFriend}
          onSelection={handleFriendSelection}
          friends={friends}
        />
        {showAddFriend ? (
          <FormAddFriend handleAddFriends={handleAddFriends} />
        ) : null}
        <Button onClick={handleAddFriendBtn}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          yourExpense={yourExpense}
          setYourExpense={setYourExpense}
          bill={billValue}
          setBill={setBillValue}
          selectedFriend={selectedFriend}
          friendExpense={friendExpense}
          handleSplit={handleSplit}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ selectedFriend, friends, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          friend={friend}
          key={friend.name}
        />
      ))}
    </ul>
  );
}
function Friend({ selectedFriend, friend, onSelection }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
function FormAddFriend({ handleAddFriends }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48?u=499476");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !img) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${img}?=${id}`,
      balance: 0,
    };
    handleAddFriends(newFriend);
    setName("");
    setImg("https://i.pravatar.cc/48?u=499476");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌇Image Url</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />

      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({
  setYourExpense,
  friendExpense,
  yourExpense,
  handleSplit,
  bill,
  setBill,
  selectedFriend,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !yourExpense) return;
    handleSplit(whoIspaying === "user" ? friendExpense : -yourExpense);
    setYourExpense(0);
    setBill(0);
  }
  const [whoIspaying, setWhoIsPaying] = useState("user");
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰Bill Value</label>
      <input
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        type="Number"
      />

      <label>🧍‍♂️Your Expense</label>
      <input
        value={yourExpense}
        onChange={(e) =>
          setYourExpense(
            Number(e.target.value) > bill ? yourExpense : Number(e.target.value)
          )
        }
        type="Number"
      />

      <label>👭{selectedFriend.name}'s Expensee</label>
      <input value={friendExpense} type="Number" disabled />

      <label>who is paying the bill</label>
      <select
        value={whoIspaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
