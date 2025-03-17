'use client';

export default function Logs() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ログ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Users" value="1,234" />
        <StatCard title="Active Now" value="56" />
        <StatCard title="New Today" value="12" />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <ActivityItem key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ActivityItem() {
  return (
    <div className="border-b pb-2">
      <p className="font-medium">User signed up</p>
      <p className="text-sm text-gray-500">2 minutes ago</p>
    </div>
  );
}