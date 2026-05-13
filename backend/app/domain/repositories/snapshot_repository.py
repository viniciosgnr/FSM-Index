from abc import ABC, abstractmethod
from typing import List
from app.domain.entities.snapshot import MonthlySnapshot
from app.domain.entities.fpso_unit import FpsoUnit

class SnapshotRepository(ABC):
    @abstractmethod
    async def get_fleet_snapshots(self) -> List[MonthlySnapshot]:
        """Returns all monthly snapshots for the whole fleet."""
        pass

    @abstractmethod
    async def get_fpso_snapshots(self) -> List[FpsoUnit]:
        """Returns monthly breakdown for each FPSO unit."""
        pass
