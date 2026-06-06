import React, { useState, useRef } from 'react';
import { Camera, Mail, School, BookOpen, Edit2, Check, X, Phone, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Samuel Ajak',
    email: 'samuelajak205@gmail.com',
    role: role,
    phone: '+256 700 000000',
    bio: 'Diligent student committed to excellence.',
    grade: 'Senior 4',
    school: 'Light High School',
  });
  const [previewImage, setPreviewImage] = useState<string | null>('https://ui-avatars.com/api/?name=Samuel+Ajak&background=random');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImage(imageUrl);
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would implement actual API saving logic
  };

  return (
    <div className="p-4 md:p-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="relative">
            <img src={previewImage || 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" />
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <Camera size={16} className="text-gray-600" />
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                <p className="text-gray-500 capitalize">{profileData.role}</p>
                <button onClick={() => setIsEditing(true)} className="mt-3 text-blue-600 flex items-center gap-1 text-sm hover:underline">
                  <Edit2 size={14} /> Edit Profile
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <input 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full text-xl font-bold border-b p-1 text-gray-900"
                />
                <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm">Save Changes</button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={20} className="text-gray-400" /> <span>{profileData.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={20} className="text-gray-400" /> 
              {isEditing ? <input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="border rounded p-1 w-full" /> : <span>{profileData.phone}</span>}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <School size={20} className="text-gray-400" /> <span>{profileData.school}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <BookOpen size={20} className="text-gray-400" /> <span>Grade: {profileData.grade}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8 border-t pt-6">
          <h3 className="font-semibold text-gray-800 mb-2">About Me</h3>
          {isEditing ? (
             <textarea 
               value={profileData.bio} 
               onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
               className="w-full border rounded-lg p-3 text-gray-600"
               rows={3}
             />
          ) : (
            <p className="text-gray-600">{profileData.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
