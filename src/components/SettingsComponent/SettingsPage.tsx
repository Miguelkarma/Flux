"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Check,
  Key,
  KeyIcon,
  KeyRound,
  KeySquare,
  Loader2,
  Mail,
  MailCheck,
  User,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserSettings } from "@/hooks/use-settings";
import { useEffect } from "react";

export default function SettingsPage() {
  const [
    {
      userData,
      loading,
      error,
      success,
      currentPassword,
      newPassword,
      confirmPassword,
      newEmail,
      newUsername,
    },
    {
      setCurrentPassword,
      setNewPassword,
      setConfirmPassword,
      setNewEmail,
      setNewUsername,
      updateUsername,
      updateUserEmail,
      updateUserPassword,
      refreshUserData,
    },
  ] = useUserSettings();

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  if (loading && !userData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleUpdateUsername = async () => {
    await updateUsername();
  };

  const handleUpdateEmail = async () => {
    await updateUserEmail();
  };

  const handleUpdatePassword = async () => {
    await updateUserPassword();
  };

  const currentEmail = userData?.email || "";
  const currentDisplayName = userData?.displayName || "";

  return (
    <div className="container mx-auto w-full h-full px-4 py-14">
      {error && (
        <Alert
          variant="destructive"
          className="mb-6 shadow-red-300 shadow bg-background"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 text-popover-foreground shadow shadow-popover-foreground">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="h-full max-w-full mx-auto ">
        <TabsList className="grid w-full grid-cols-3 bg-secondary text-popover-foreground shadow shadow-popover-foreground">
          <TabsTrigger className="hover:bg-background " value="profile">
            Profile
          </TabsTrigger>
          <TabsTrigger className="hover:bg-background" value="email">
            Email
          </TabsTrigger>
          <TabsTrigger className="hover:bg-background" value="password">
            Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6 ">
          <Card className="shadow shadow-popover-foreground ">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your username</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Your username"
                  icon={User}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdateUsername}
                disabled={loading || newUsername === currentDisplayName}
                className="bg-gradient-to-br from-gray-700 to-teal-400/50 text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update Username
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 mt-6 ">
          <Card className="shadow shadow-popover-foreground">
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Change your email address. You'll need to verify your current
                password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-email">Current Email</Label>
                <Input
                  id="current-email"
                  value={currentEmail}
                  disabled
                  icon={Mail}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="your-new-email@example.com"
                  icon={MailCheck}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-password-email">Current Password</Label>
                <Input
                  id="current-password-email"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  icon={KeyIcon}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdateEmail}
                disabled={
                  loading || newEmail === currentEmail || !currentPassword
                }
                className="bg-gradient-to-br from-gray-700 to-teal-400/50 text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update Email
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6 mt-6">
          <Card className="shadow shadow-popover-foreground">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password. You'll need to verify your current
                password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  icon={Key}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  icon={KeySquare}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  icon={KeyRound}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdatePassword}
                disabled={
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  newPassword !== confirmPassword
                }
                className="bg-gradient-to-br from-gray-700 to-teal-400/50 text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
