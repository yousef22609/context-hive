
-- Function to safely increment points for a user
CREATE OR REPLACE FUNCTION public.increment_points(user_id UUID, points_to_add INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_points INT;
  new_points INT;
BEGIN
  -- Get current points
  SELECT total_points INTO current_points FROM profiles WHERE id = user_id;
  
  -- Calculate new points value
  new_points := COALESCE(current_points, 0) + points_to_add;
  
  -- Update user's points
  UPDATE profiles SET total_points = new_points WHERE id = user_id;
  
  -- Return new points value
  RETURN new_points;
END;
$$;
