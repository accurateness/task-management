import "./App.css";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  rank: number;
  name: string;
  email: string;
  image: string;
  friends: string[];
}

const sampleData: User[] = [
  {
    id: "1",
    rank: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    friends: ["2", "3", "4"],
    image: "https://picsum.photos/200",
  },
  {
    id: "2",
    rank: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    friends: ["1", "3"],
    image: "https://picsum.photos/200",
  },
  {
    id: "3",
    rank: 3,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    friends: ["1", "2"],
    image: "https://picsum.photos/200",
  },
  {
    id: "4",
    rank: 4,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    friends: ["1"],
    image: "https://picsum.photos/200",
  },
  {
    id: "5",
    rank: 5,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    friends: [],
    image: "https://picsum.photos/200",
  },
  {
    id: "6",
    rank: 6,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    friends: [],
    image: "https://picsum.photos/200",
  },
  {
    id: "7",
    rank: 7,
    name: "Christopher Wilson",
    email: "christopher.wilson@example.com",
    friends: [],
    image: "https://picsum.photos/200",
  },
];

function formatUser(user: User, users: User[]) {
  const friendNames = user.friends.map((friendId) => {
    const friend = users.find((u) => u.id === friendId);
    return friend ? friend.name : "Unknown";
  });

  let highestRankingFriendName: string = "";
  if (user.friends.length) {
    let highestRankingFriendId = user.friends.reduce(
      (highestRankingFriendId, friendId) => {
        const friend = users.find((u) => u.id === friendId);
        const highRankingFriend = users.find(
          (u) => u.id === highestRankingFriendId
        );
        if (!friend) return highestRankingFriendId;
        if (highRankingFriend) {
          return friend.rank > highRankingFriend.rank
            ? friendId
            : highestRankingFriendId;
        }
        return highestRankingFriendId;
      },
      user.friends[0]
    );
    let highestRankingFriend = users.find(
      (u) => u.id === highestRankingFriendId
    );
    highestRankingFriendName = highestRankingFriend
      ? highestRankingFriend.name
      : "";
  }

  return { ...user, friendNames, highestRankingFriendName };
}

function User({
  user,
  onClick,
  isSelected,
}: {
  user: User;
  onClick: (id: string) => void;
  isSelected: boolean;
}) {
  return (
    <div
      className={`user ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(user.id)}
    >
      <img src={user.image} alt={user.name} />
      <div className="user-details">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>Friends: {formatUser(user, sampleData).friendNames.join(", ")}</p>
        <p>
          Highest Ranking Friend:{" "}
          {formatUser(user, sampleData).highestRankingFriendName}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const navigate = useNavigate();

  const authtoken = localStorage.getItem("authtoken");
  
  if (!authtoken) {
    navigate("/signup");
  }

  useEffect(() => {
    // Fetch the users data from an API endpoint
    // and set the users state variable
    setUsers(sampleData);
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users.filter((user) => {
      const userString = `${user.id} ${user.name} ${user.friends.join(
        " "
      )}`.toLowerCase();
      return userString.includes(query);
    });
  }, [users, searchQuery]);

  const handleUserClick = (id: string) => {
    setSelectedUser(id === selectedUser ? null : id);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search by name, ID, or friend's ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="users">
        {filteredUsers.map((user) => (
          <User
            key={user.id}
            user={formatUser(user, users)}
            onClick={handleUserClick}
            isSelected={user.id === selectedUser}
          />
        ))}
      </div>
    </>
  );
}
