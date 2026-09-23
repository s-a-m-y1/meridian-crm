"use client";

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button className="px-3 py-2 text-sm font-medium rounded-md bg-primary text-white">Profile</button>
        <button className="px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">Password</button>
        <button className="px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">Notifications</button>
        <button className="px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">Security</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              defaultValue="Ahmed Alrashid"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue="ahmed.alrashid@riyadhrealestate.sa"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
