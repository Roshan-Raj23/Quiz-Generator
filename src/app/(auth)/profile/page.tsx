"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Eye, Camera, Save, Trophy, Target, BarChart3, Award, Star } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { User } from "@/Model/User"
import { usePathname, useRouter } from "next/navigation"

export default function ProfilePage() {

  const pathname = usePathname()
  const router = useRouter();
  // const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate educator and quiz creator with over 5 years of experience in e-learning. I love creating engaging content that helps people learn and grow.",
    website: "https://sarahjohnson.edu",
    organization: "Stanford University",
    role: "Senior Lecturer",
  })
  const [currentUser , setCurrentUser] = useState<User>()

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    marketingEmails: false,
    publicProfile: true,
    showStats: true,
    theme: "light",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
  })

  const userStats = {
    quizzesCreated: 24,
    totalResponses: 1247,
    averageScore: 78,
    topCategory: "Science",
    joinDate: "January 2023",
    streak: 15,
    achievements: 8,
    followers: 156,
  }

  const recentActivity = [
    { type: "quiz_created", title: "JavaScript Fundamentals", date: "2 days ago", responses: 45 },
    { type: "achievement", title: "Quiz Master Badge", date: "1 week ago", description: "Created 20+ quizzes" },
    { type: "quiz_shared", title: "World Geography", date: "1 week ago", shares: 12 },
    {
      type: "milestone",
      title: "1000 Total Responses",
      date: "2 weeks ago",
      description: "Reached 1000 quiz responses",
    },
  ]

  const achievements = [
    { name: "First Quiz", description: "Created your first quiz", earned: true, date: "Jan 2023" },
    { name: "Popular Creator", description: "Quiz received 100+ responses", earned: true, date: "Feb 2023" },
    { name: "Quiz Master", description: "Created 20+ quizzes", earned: true, date: "Mar 2023" },
    { name: "Engagement Expert", description: "Average score above 75%", earned: true, date: "Apr 2023" },
    { name: "Consistent Creator", description: "15-day creation streak", earned: true, date: "May 2023" },
    { name: "Community Favorite", description: "100+ followers", earned: true, date: "Jun 2023" },
    { name: "Perfectionist", description: "Create a quiz with 95%+ average score", earned: false, date: null },
    { name: "Viral Creator", description: "Quiz shared 50+ times", earned: false, date: null },
  ]

  const handleSave = () => {
    // Save profile data
    console.log("Saving profile:", profileData)
    // setIsEditing(false)
    alert("Profile updated successfully!")
  }

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key: string, value: boolean | string) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }))
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz_created":
        return <Target className="h-4 w-4 text-blue-500" />
      case "achievement":
        return <Award className="h-4 w-4 text-yellow-500" />
      case "quiz_shared":
        return <Eye className="h-4 w-4 text-green-500" />
      case "milestone":
        return <Trophy className="h-4 w-4 text-purple-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  useEffect(() => {
    getUser();
  }, [pathname]);

  const getUser = async () => {
    const response = await axios.get('/api/getCurrentUser')

    setCurrentUser(response.data.user);
  }
  
  const logoutUser = async () => {
  
    try {
      await axios.get('/api/logout')
      toast.success("Logged out successfully");
      router.push('/'); 
    } catch {
      toast.error("Something went wrong");
    }
  }

  const makeCreator = async () => {
    if (!currentUser) {
      toast.error("SignIn to become Creator");
      return;
    }
    if (currentUser.isCreator) {
      toast.success("You are already Creator");
      return;
    }

    // TODO: you can add a form in here to verify as a creator

    const response = await axios.post('/api/makeCreator', {email: currentUser.email})

    if (response.data.status == 200) {
      toast.success("You are now Creator");
      getUser();
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-24 h-24">
                        {/* TODO: no image error */}
                        <AvatarImage src="https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg" alt="Profile" />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                          {profileData.firstName[0]}
                          {profileData.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 rounded-full bg-transparent"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-primary font-medium mb-2">{profileData.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{profileData.organization}</p>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{profileData.location}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {userStats.joinDate}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{profileData.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.quizzesCreated}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Quizzes Created</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {userStats.totalResponses.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Responses</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.averageScore}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Score</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.achievements}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Achievements</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userStats.streak}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Day Streak</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userStats.followers}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{userStats.topCategory}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Top Category</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{activity.date}</p>
                        {activity.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
                        )}
                      </div>
                      {activity.responses && <Badge variant="secondary">{activity.responses} responses</Badge>}
                      {activity.shares && <Badge variant="secondary">{activity.shares} shares</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edit Profile Tab */}
          <TabsContent value="edit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={profileData.organization}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, organization: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Role/Title</Label>
                  <Input
                    id="role"
                    value={profileData.role}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, role: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="w-full flex justify-center items-center gap-4">
              {currentUser && !currentUser.isCreator && 
                <Button type="button" variant="ghost" 
                className="bg-green-500 hover:bg-green-400" 
                onClick={makeCreator}>Become Creator</Button>
              }
              <Button type="button" variant="destructive" 
              className="bg-red-500 hover:bg-red-400" 
              onClick={logoutUser}>Logout</Button>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.earned
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            achievement.earned
                              ? "bg-primary text-white"
                              : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {achievement.earned ? <Award className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{achievement.description}</p>
                          {achievement.earned && achievement.date && (
                            <p className="text-xs text-primary font-medium">Earned {achievement.date}</p>
                          )}
                          {!achievement.earned && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Not yet earned</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get a weekly summary of your activity</p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={preferences.weeklyDigest}
                    onCheckedChange={(checked) => handlePreferenceChange("weeklyDigest", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about new features</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => handlePreferenceChange("marketingEmails", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Make your profile visible to others</p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={preferences.publicProfile}
                    onCheckedChange={(checked) => handlePreferenceChange("publicProfile", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-stats">Show Statistics</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Display your quiz statistics publicly</p>
                  </div>
                  <Switch
                    id="show-stats"
                    checked={preferences.showStats}
                    onCheckedChange={(checked) => handlePreferenceChange("showStats", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-alerts">Login Alerts</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    id="login-alerts"
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) => handleSecurityChange("loginAlerts", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => handleSecurityChange("sessionTimeout", value)}
                  >
                    <SelectTrigger className="w-48 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Password</h3>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
                      Export Account Data
                    </Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
