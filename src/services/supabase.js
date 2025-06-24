import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://tbrufdtayxzponnoomvp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicnVmZHRheXh6cG9ubm9vbXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTcwMzUsImV4cCI6MjA1NjkzMzAzNX0.vhMIJbRJRSZEr1G3eL1TE43luXyllNNFav9OhnrLQ_U";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
