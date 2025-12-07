-- Add foreign key references after all tables exist
ALTER TABLE activities 
  ADD CONSTRAINT fk_activities_project 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

ALTER TABLE activities 
  ADD CONSTRAINT fk_activities_deal 
  FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL;

-- Add indexes for the new columns
CREATE INDEX idx_activities_project ON activities(project_id);
CREATE INDEX idx_activities_deal ON activities(deal_id);
