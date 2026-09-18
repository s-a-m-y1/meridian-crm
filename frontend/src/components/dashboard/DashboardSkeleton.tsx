"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Leads */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-4 h-12 bg-gray-200 dark:bg-gray-700 rounded"></th>
                      <th className="text-left p-4 h-12 bg-gray-200 dark:bg-gray-700 rounded"></th>
                      <th className="text-left p-4 h-12 bg-gray-200 dark:bg-gray-700 rounded"></th>
                      <th className="text-left p-4 h-12 bg-gray-200 dark:bg-gray-700 rounded"></th>
                      <th className="text-left p-4 h-12 bg-gray-200 dark:bg-gray-700 rounded"></th>
                      <th className="text-left p-4 h-12 bg-gray-200 dark:bg-gray-700 rounded"></th>
                      <th className="text-left p-4 h-12 bg-gray-200 dark:bg-gray-700 rounded"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4">
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                          <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </td>
                        <td className="p-4"><div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                        <td className="p-4"><div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
                        <td className="p-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                        <td className="p-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded font-medium"></div></td>
                        <td className="p-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                        <td className="p-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                      </tr>
                    ))}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                        <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </td>
                      <td className="p-4"><div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                      <td className="p-4"><div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
                      <td className="p-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                      <td className="p-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded font-medium"></div></td>
                      <td className="p-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                      <td className="p-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Today 10:00 AM</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                    <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                      <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}