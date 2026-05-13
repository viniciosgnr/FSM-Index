from typing import List
from app.domain.entities.fpso_unit import FpsoUnit
from app.domain.repositories.snapshot_repository import SnapshotRepository

class GetFpsoSnapshots:
    def __init__(self, repository: SnapshotRepository):
        self.repository = repository

    async def execute(self) -> List[FpsoUnit]:
        return await self.repository.get_fpso_snapshots()
