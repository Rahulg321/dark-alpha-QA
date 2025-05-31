-- Drop the existing foreign key constraint
ALTER TABLE embeddings DROP CONSTRAINT embeddings_resource_id_resources_id_fk;

-- Add the new foreign key constraint with CASCADE
ALTER TABLE embeddings 
ADD CONSTRAINT embeddings_resource_id_resources_id_fk 
FOREIGN KEY (resource_id) 
REFERENCES resources(id) 
ON DELETE CASCADE;