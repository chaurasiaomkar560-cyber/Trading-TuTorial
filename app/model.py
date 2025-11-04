from supabase import create_client, Client
import os

def init_supabase():
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials are missing!")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase
