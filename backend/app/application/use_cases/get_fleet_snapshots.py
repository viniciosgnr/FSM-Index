from typing import List
from app.domain.entities.snapshot import MonthlySnapshot
from app.domain.repositories.snapshot_repository import SnapshotRepository

class GetFleetSnapshots:
    def __init__(self, repository: SnapshotRepository):
        self.repository = repository

    async def execute(self) -> List[MonthlySnapshot]:
        return await self.repository.get_fleet_snapshots()
