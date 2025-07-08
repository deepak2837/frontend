import { API_URL } from "@/config/config";

export default async function handler(req, res) {
  const { mobileNumber } = req.query;
  if (!mobileNumber) {
    return res.status(400).json({ registered: false });
  }
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/user-exists?mobileNumber=${mobileNumber}`);
    const data = await response.json();
    return res.status(200).json({ registered: data.exists });
  } catch (error) {
    return res.status(500).json({ registered: false });
  }
} 