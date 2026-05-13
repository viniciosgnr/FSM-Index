from fastapi import APIRouter, Depends
from typing import List
from app.application.use_cases.get_fleet_snapshots import GetFleetSnapshots
from app.application.use_cases.get_fpso_snapshots import GetFpsoSnapshots
from app.infrastructure.repositories.supabase_snapshot_repo import SupabaseSnapshotRepository
from app.infrastructure.database import get_db

router = APIRouter()

def get_snapshot_repo(db=Depends(get_db)):
    return SupabaseSnapshotRepository(db)

@router.get("/fleet")
async def get_fleet(repo=Depends(get_snapshot_repo)):
    use_case = GetFleetSnapshots(repo)
    snapshots = await use_case.execute()
    
    # Map domain entities to frontend-friendly JSON
    return [
        {
            "planejadas": s.planejadas,
            "executadasNoPrazo": s.executadas_no_prazo,
            "foraDoPrazo": s.fora_do_prazo,
            "overdue": s.overdue,
            "execAntecipadas": s.exec_antecipadas,
            "mitigacoes": s.mitigacoes,
            "faa": s.faa,
            "ptci": s.ptci,
            "mci": s.mci,
            "faai": s.faai,
            "referenceMonth": str(s.reference_month)
        }
        for s in snapshots
    ]

@router.get("/fpso")
async def get_fpso(repo=Depends(get_snapshot_repo)):
    use_case = GetFpsoSnapshots(repo)
    units = await use_case.execute()
    
    return [
        {
            "code": u.code,
            "months": [
                {
                    "pctNoPrazo": m.pct_no_prazo,
                    "realizadas": m.realizadas,
                    "planejadas": m.planejadas,
                    "antecipadas": m.antecipadas,
                    "referenceMonth": str(m.reference_month)
                }
                for m in u.months
            ]
        }
        for u in units
    ]
