-- =======================================================
-- ARRAI SuperApp - Supabase Database Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rrozayjjlvlxgznwzbuu/sql
-- =======================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT,
    phone TEXT,
    email TEXT,
    vpa TEXT,
    avatar TEXT,
    bio TEXT,
    wallet_balance NUMERIC DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write for profiles" ON public.profiles FOR ALL USING (true);

-- 2. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    recipient_vpa TEXT,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SUCCESS',
    category TEXT DEFAULT 'upi',
    utr TEXT,
    upi_ref TEXT,
    payment_method TEXT,
    receipt_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write for transactions" ON public.transactions FOR ALL USING (true);

-- 3. Call Logs & True Shield Directory
CREATE TABLE IF NOT EXISTS public.call_logs (
    id BIGSERIAL PRIMARY KEY,
    caller_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    call_type TEXT NOT NULL,
    duration TEXT DEFAULT '00:00',
    is_spam BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write for call_logs" ON public.call_logs FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS public.caller_directory (
    id BIGSERIAL PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL,
    caller_name TEXT NOT NULL,
    carrier TEXT DEFAULT 'Jio 5G',
    is_spam BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.caller_directory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for caller_directory" ON public.caller_directory FOR SELECT USING (true);

-- Sample verified caller records
INSERT INTO public.caller_directory (phone_number, caller_name, carrier, is_spam, verified)
VALUES 
    ('+91 98765 43210', 'Priya Sharma (Personal)', 'Airtel 5G', false, true),
    ('+91 14098 21192', 'Suspected Loan Spam Bot', 'VoIP Gateway', true, false),
    ('+91 98201 00000', 'Abhishek Rai (Verified)', 'Jio True 5G', false, true)
ON CONFLICT (phone_number) DO NOTHING;

-- 4. Merchant Payment Links
CREATE TABLE IF NOT EXISTS public.payment_links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-write for payment_links" ON public.payment_links FOR ALL USING (true);
