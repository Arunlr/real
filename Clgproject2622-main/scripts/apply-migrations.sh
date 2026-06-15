#!/bin/bash

# Apply Database Migrations Script
# This script applies the database schema and seed data to your Supabase project

set -e  # Exit on error

echo "🚀 Starting database migration..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Supabase project details
PROJECT_ID="zbefuotnmdvbqietdhhf"
PROJECT_URL="https://${PROJECT_ID}.supabase.co"

echo -e "${YELLOW}Project URL:${NC} $PROJECT_URL"
echo ""

# Check if migrations directory exists
if [ ! -d "supabase/migrations" ]; then
    echo -e "${RED}Error: supabase/migrations directory not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if migration files exist
SCHEMA_FILE="supabase/migrations/20260513000001_initial_schema.sql"
SEED_FILE="supabase/migrations/20260513000002_seed_data.sql"

if [ ! -f "$SCHEMA_FILE" ]; then
    echo -e "${RED}Error: Schema migration file not found: $SCHEMA_FILE${NC}"
    exit 1
fi

if [ ! -f "$SEED_FILE" ]; then
    echo -e "${RED}Error: Seed data migration file not found: $SEED_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Migration files found"
echo ""

# Instructions for manual application
echo -e "${YELLOW}=== Manual Migration Instructions ===${NC}"
echo ""
echo "1. Open your Supabase Dashboard:"
echo -e "   ${GREEN}https://supabase.com/dashboard/project/${PROJECT_ID}/sql${NC}"
echo ""
echo "2. Click 'New Query' button"
echo ""
echo "3. Copy and paste the contents of:"
echo -e "   ${YELLOW}$SCHEMA_FILE${NC}"
echo ""
echo "4. Click 'Run' or press Ctrl+Enter"
echo ""
echo "5. Wait for completion (should take a few seconds)"
echo ""
echo "6. Repeat steps 2-5 for:"
echo -e "   ${YELLOW}$SEED_FILE${NC}"
echo ""
echo "7. Verify tables were created:"
echo "   - Go to Database → Tables"
echo "   - You should see: profiles, places, verifications, rewards, etc."
echo ""

echo -e "${YELLOW}=== What Gets Created ===${NC}"
echo ""
echo "📊 Tables:"
echo "  • profiles - User profiles and stats"
echo "  • places - Hotels, gyms, restaurants, hospitals, etc."
echo "  • verifications - User reviews and verifications"
echo "  • rewards - User rewards and incentives"
echo "  • credit_transactions - Transaction history"
echo "  • verification_tasks - Available tasks"
echo "  • achievements - System badges"
echo "  • user_achievements - Earned achievements"
echo "  • leaderboard - Rankings by period"
echo ""

echo "🔒 Security:"
echo "  • Row Level Security (RLS) enabled on all tables"
echo "  • Policies for public read, user-specific write"
echo "  • Auto-profile creation on signup"
echo ""

echo "🎯 Features:"
echo "  • Auto-update timestamps"
echo "  • Auto-calculate place ratings"
echo "  • Indexes for performance"
echo "  • Sample seed data"
echo ""

echo -e "${YELLOW}=== After Migration ===${NC}"
echo ""
echo "1. Update your code to use new hooks:"
echo -e "   ${GREEN}import { useProfile, usePlaces } from '@/hooks/useDatabase';${NC}"
echo ""
echo "2. Test the database:"
echo "   • Navigate to /admin panel"
echo "   • Check if places load"
echo "   • Try creating a verification"
echo ""
echo "3. Check seed data:"
echo "   • Should have ~15 places (hotels, gyms, restaurants, hospitals)"
echo "   • Should have 8 achievements"
echo "   • Should have 4 verification tasks"
echo ""

echo -e "${GREEN}=== Ready to Apply? ===${NC}"
echo ""
echo "Follow the manual instructions above to apply the migrations."
echo "Or see DATABASE_SETUP_GUIDE.md for detailed setup instructions."
echo ""
echo -e "${YELLOW}Note:${NC} This script provides instructions only."
echo "You'll need to apply the SQL manually via the Supabase Dashboard."
echo ""

exit 0
