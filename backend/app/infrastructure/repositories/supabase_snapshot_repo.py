from typing import List
from app.domain.entities.snapshot import MonthlySnapshot
from app.domain.entities.fpso_unit import FpsoUnit, FpsoMonthlyDetail
from app.domain.repositories.snapshot_repository import SnapshotRepository
from app.domain.value_objects.year_month import YearMonth
from app.infrastructure.database import Database

class SupabaseSnapshotRepository(SnapshotRepository):
    def __init__(self, db: Database):
        self.db = db

    async def get_fleet_snapshots(self) -> List[MonthlySnapshot]:
        query = """
            SELECT reference_month, planejadas, executadas_no_prazo, fora_do_prazo, 
                   overdue, exec_antecipadas, mitigacoes, faa, ptci, mci
            FROM fsm_snapshots
            WHERE region_id IS NULL
            ORDER BY reference_month ASC
        """
        snapshots = []
        with self.db.get_cursor() as cur:
            cur.execute(query)
            for row in cur.fetchall():
                snapshots.append(MonthlySnapshot(
                    reference_month=YearMonth.from_date(row['reference_month']),
                    planejadas=row['planejadas'],
                    executadas_no_prazo=row['executadas_no_prazo'],
                    fora_do_prazo=row['fora_do_prazo'],
                    overdue=row['overdue'],
                    exec_antecipadas=row['exec_antecipadas'],
                    mitigacoes=row['mitigacoes'],
                    faa=row['faa'],
                    ptci=float(row['ptci']),
                    mci=float(row['mci'])
                ))
        return snapshots

    async def get_fpso_snapshots(self) -> List[FpsoUnit]:
        # First get all regions
        regions_query = "SELECT id, code FROM fsm_regions ORDER BY code ASC"
        
        # Then get all monthly data for all FPSOs
        data_query = """
            SELECT r.code, m.reference_month, m.pct_no_prazo, m.realizadas, m.planejadas, m.antecipadas
            FROM fsm_fpso_monthly m
            JOIN fsm_regions r ON m.region_id = r.id
            ORDER BY r.code ASC, m.reference_month ASC
        """
        
        fpso_units = {}
        with self.db.get_cursor() as cur:
            cur.execute(data_query)
            for row in cur.fetchall():
                code = row['code']
                if code not in fpso_units:
                    fpso_units[code] = []
                
                fpso_units[code].append(FpsoMonthlyDetail(
                    reference_month=YearMonth.from_date(row['reference_month']),
                    pct_no_prazo=float(row['pct_no_prazo']) if row['pct_no_prazo'] is not None else None,
                    realizadas=row['realizadas'],
                    planejadas=row['planejadas'],
                    antecipadas=row['antecipadas']
                ))
        
        return [FpsoUnit(code=code, months=months) for code, months in fpso_units.items()]
