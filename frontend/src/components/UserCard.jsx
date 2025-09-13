export default function UserCard({ user, onEdit, onDelete, onVerify }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.verified 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {user.verified ? 'Verified' : 'Unverified'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phone:</span> {user.phone}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Address:</span> {user.addr}
        </p>
        {user.otp && (
          <p className="text-sm text-blue-600 font-medium">
            <span className="font-medium">OTP:</span> {user.otp}
          </p>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(user)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        {!user.verified && user.otp && (
          <button
            onClick={() => onVerify(user)}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
          >
            Verify
          </button>
        )}
        <button
          onClick={() => onDelete(user._id)}
          className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}